import React, { useEffect, useRef, useState, useContext } from "react";
import "../styles/tour-details.css";
import { Container, Row, Col, Form, ListGroup, Button } from "reactstrap";
import { useParams } from "react-router-dom";
import calculateAvgRating from "./../utils/avgRating";
import avatar from "../assets/images/avatar.jpg";
import Booking from "../components/Booking/Booking";
import Newsletter from "./../shared/Newsletter";
import useFetch from "./../hooks/useFetch";
import BASE_URL from "./../utils/config";
import { AuthContext } from "./../context/AuthContext";
import { io } from "socket.io-client";
import TourCard from "../shared/TourCard";

const TourDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef("");
  const [tourRating, setTourRating] = useState(null);
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  //fetch data from database
  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);

  const {
    _id,
    photo,
    title,
    desc,
    price,
    address,
    reviews = [],
    city,
    distance,
    maxGroupSize,
    coordinates,
  } = tour;

  const { totalRating, avgRating } = calculateAvgRating(reviews);

  const options = { day: "numeric", month: "long", year: "numeric" };
  const hasCoordinates =
    coordinates &&
    typeof coordinates.lat === "number" &&
    typeof coordinates.lng === "number";
  const mapQuery = hasCoordinates
    ? `${coordinates.lat},${coordinates.lng}`
    : `${address}, ${city}`;

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    try {
      if (!user || user === undefined || user === null) {
        alert("Please sign in");
      }

      const reviewObj = {
        username: user?.username,
        reviewText,
        rating: tourRating,
      };
      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewObj),
      });

      const result = await res.json();
      if (!res.ok) {
        return alert(result.message);
      }
      alert(result.message);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);

  useEffect(() => {
    if (!id) return;

    const fetchAvailability = async () => {
      try {
        const res = await fetch(`${BASE_URL}/tours/${id}/availability`);
        const result = await res.json();
        if (res.ok) setAvailability(result.data);
      } catch (error) {
        console.error("Availability fetch failed");
      }
    };

    fetchAvailability();
  }, [id]);

  useEffect(() => {
    if (!_id || !user) return;

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/tours/search/recommendations?currentTourId=${_id}`,
          {
            credentials: "include",
          }
        );
        const result = await res.json();
        if (res.ok) setRecommendations(result.data || []);
      } catch (error) {
        console.error("Recommendations fetch failed");
      }
    };

    fetchRecommendations();
  }, [_id, user]);

  useEffect(() => {
    const socketBaseUrl = BASE_URL.replace("/api/v1", "");
    const socket = io(socketBaseUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("tour:availabilityUpdated", (payload) => {
      if (payload?.tourId === id) {
        setAvailability({
          tourId: payload.tourId,
          remainingSeats: payload.remainingSeats,
          bookedSeats: payload.bookedSeats,
          maxGroupSize,
        });
      }
    });

    return () => socket.disconnect();
  }, [id, maxGroupSize]);

  return (
    <>
      <section>
        <Container>
          {loading && <h4 className="text-center pt-5">Loading.......</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row>
              <Col lg="8">
                <div className="tour__content">
                  <img src={photo} alt="" />
                  <div className="tour__info">
                    <h2>{title}</h2>
                    <div className="d-flex align-items-center gap-5">
                      <span className="tour__rating d-flex align-items-center gap-1">
                        <i
                          className="ri-star-fill"
                          style={{ color: "var(--secondary-color)" }}
                        ></i>{" "}
                        {avgRating === 0 ? null : avgRating}
                        {totalRating === 0 ? (
                          "Not Rated"
                        ) : (
                          <span>({reviews.length})</span>
                        )}
                      </span>
                      <span>
                        <i className="ri-map-pin-fill"></i> {address}
                      </span>
                    </div>
                    <div className="tour-extra-details">
                      <span>
                        <i className="ri-map-pin-2-line"></i>
                        {city}{" "}
                      </span>
                      <span>
                        <i className="ri-money-dollar-circle-line"></i>
                        {price}/ per person{" "}
                      </span>
                      <span>
                        <i className="ri-map-pin-time-line"></i>
                        {distance} km{" "}
                      </span>
                      <span>
                        <i className="ri-group-line"></i>
                        {maxGroupSize} people{" "}
                      </span>
                    </div>
                    <h5>Description</h5>
                    <p>{desc}</p>
                    <h5 className="mt-4">Location Preview</h5>
                    <iframe
                      title="Tour Location"
                      width="100%"
                      height="320"
                      style={{ border: 0, borderRadius: "12px" }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        mapQuery
                      )}&z=12&output=embed`}
                    />
                    {availability && (
                      <p className="mt-3 fw-semibold text-danger">
                        Live seats left: {availability.remainingSeats}
                      </p>
                    )}
                  </div>
                  {/* tour reviews section start */}
                  <div className="tour__reviews mt-4">
                    <h4>Reviews ({reviews?.length} reviews)</h4>
                    <Form onSubmit={submitHandler}>
                      <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                        <span onClick={() => setTourRating(1)}>
                          {" "}
                          1 <i className="ri-star-s-fill"></i>
                        </span>
                        <span onClick={() => setTourRating(2)}>
                          {" "}
                          2 <i className="ri-star-s-fill"></i>
                        </span>
                        <span onClick={() => setTourRating(3)}>
                          {" "}
                          3 <i className="ri-star-s-fill"></i>
                        </span>
                        <span onClick={() => setTourRating(4)}>
                          {" "}
                          4 <i className="ri-star-s-fill"></i>
                        </span>
                        <span onClick={() => setTourRating(5)}>
                          {" "}
                          5 <i className="ri-star-s-fill"></i>
                        </span>
                      </div>
                      <div className="review__input">
                        <input
                          type="text"
                          ref={reviewMsgRef}
                          placeholder="Share your thoughts"
                          required
                        />
                        <Button
                          className="btn primary__btn text-white"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </div>
                    </Form>
                    <ListGroup className="user__reviews">
                      {reviews?.map((review, index) => (
                        <div className="review__item" key={index}>
                          <img src={avatar} alt="" />
                          <div className="w-100">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h5>{review.username}</h5>
                              </div>
                              <p>
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-US",
                                  options
                                )}
                              </p>
                            </div>
                            <span className="d-flex align-items-center">
                              {review.rating}
                              <i className="ri-star-s-fill"></i>
                            </span>
                          </div>
                          <h6>{review.reviewText}</h6>
                        </div>
                      ))}
                    </ListGroup>
                  </div>
                  {/* tour reviews section stop */}
                </div>
              </Col>
              <Col lg="4">
                <Booking tour={tour} avgRating={avgRating} availability={availability} />
              </Col>
            </Row>
          )}
        </Container>
      </section>
      {recommendations.length > 0 && (
        <section className="pt-0">
          <Container>
            <h4 className="mb-4">Recommended for you</h4>
            <Row>
              {recommendations.map((recommendedTour) => (
                <Col lg="3" md="6" sm="6" className="mb-4" key={recommendedTour._id}>
                  <TourCard tour={recommendedTour} />
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      <Newsletter />
    </>
  );
};

export default TourDetails;
