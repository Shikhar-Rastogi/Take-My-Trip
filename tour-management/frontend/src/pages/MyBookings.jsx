import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col } from "reactstrap";
import BASE_URL from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import "../styles/my-bookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/booking/my-bookings`, {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setBookings(data.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchBookings();
  }, [user]);

  // 🔥 cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      const res = await fetch(`${BASE_URL}/booking/${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // remove cancelled booking from UI
      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );

      alert("Booking cancelled successfully");
    } catch (err) {
      alert(err.message || "Failed to cancel booking");
    }
  };

  return (
    <Container className="my-bookings">
      <h2 className="mb-4">My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <Row key={booking._id} className="booking-card">
            <Col md="12">
              <h5>{booking.tourName}</h5>

              <p>
                <strong>Name:</strong> {booking.fullName}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(booking.bookAt).toDateString()}
              </p>

              <p>
                <strong>People:</strong> {booking.guestSize}
              </p>

              <p>
                <strong>Phone:</strong> {booking.phone}
              </p>

              <div className="d-flex align-items-center gap-3 mt-2">
                <span className="status">Confirmed</span>

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleCancelBooking(booking._id)}
                >
                  Cancel
                </button>
              </div>
            </Col>
          </Row>
        ))
      )}
    </Container>
  );
};

export default MyBookings;
