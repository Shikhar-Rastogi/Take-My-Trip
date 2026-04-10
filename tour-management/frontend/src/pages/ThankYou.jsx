import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import { Link, useLocation } from 'react-router-dom'
import '../styles/thank-you.css'

const ThankYou = () => {
  const location = useLocation();
  const tour = location.state?.tour;
  const hasCoordinates =
    tour?.coordinates &&
    typeof tour.coordinates.lat === "number" &&
    typeof tour.coordinates.lng === "number";
  const mapQuery = hasCoordinates
    ? `${tour.coordinates.lat},${tour.coordinates.lng}`
    : `${tour?.address || ""} ${tour?.city || ""}`;

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="pt-5 text-center">
            <div className="thank__you">
              
              <span className="success__icon">
                <i className="ri-checkbox-circle-line"></i>
              </span>

              <h1 className="mb-3 fw-semibold">Thank You</h1>
              <h3 className="mb-4">Your tour is booked.</h3>
              {tour?.title && (
                <p className="mb-3">
                  <strong>Destination:</strong> {tour.title} ({tour.city})
                </p>
              )}
              {mapQuery.trim() && (
                <iframe
                  title="Booked Tour Map"
                  width="100%"
                  height="240"
                  style={{ border: 0, borderRadius: "12px", marginBottom: "20px" }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    mapQuery
                  )}&z=12&output=embed`}
                />
              )}

              <div className="d-flex justify-content-center gap-3">
                <Button color="warning">
                  <Link to="/home" className="text-white text-decoration-none">
                    Back to Home
                  </Link>
                </Button>

                <Button outline color="warning">
                  <Link to="/my-bookings" className="text-decoration-none">
                    View My Bookings
                  </Link>
                </Button>
              </div>

            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default ThankYou
