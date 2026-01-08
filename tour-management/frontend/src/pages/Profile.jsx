import React, { useContext } from "react";
import { Container, Row, Col } from "reactstrap";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);

  // 🔐 Protect route
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <section>
      <Container>
        <Row className="justify-content-center">
          <Col lg="6">
            <div className="profile__card">
              <h3 className="mb-4">My Profile</h3>

              <p>
                <strong>Username:</strong> {user.username}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Profile;
