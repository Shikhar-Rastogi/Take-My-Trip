const { getRedisClient } = require("./redisClient");

const connectRedisSafely = async (client) => {
  try {
    await client.connect();
  } catch (error) {
    if (!String(error.message || "").includes("already connecting")) {
      console.error("Redis connect failed:", error.message);
    }
  }
};

const getCache = async (key) => {
  const client = getRedisClient();
  if (!client) return null;

  await connectRedisSafely(client);
  const value = await client.get(key);

  if (!value) return null;
  return JSON.parse(value);
};

const setCache = async (key, value, ttlSeconds = 120) => {
  const client = getRedisClient();
  if (!client) return;

  await connectRedisSafely(client);
  await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
};

const deleteCacheByPattern = async (pattern) => {
  const client = getRedisClient();
  if (!client) return;

  await connectRedisSafely(client);
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(keys);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCacheByPattern,
};
