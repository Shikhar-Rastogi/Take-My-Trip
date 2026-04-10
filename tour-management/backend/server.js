const http = require('http')
const { Server } = require("socket.io");
const app = require('./app')
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || origin === "http://localhost:3000" || origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.set("io", io);

io.on("connection", (socket) => {
    socket.on("disconnect", () => {});
});

const port = process.env.PORT || 8000;

server.listen(port, ()=>{
    console.log('server listening on port', port);
})
