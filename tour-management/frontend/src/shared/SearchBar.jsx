import React, { useRef } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import BASE_URL from "./../utils/config";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const locationRef = useRef("");
  const distanceRef = useRef(0);
  const maxGroupSizeRef = useRef(0);
  const navigate = useNavigate();

  const searchHandler = async () => {
    const location = locationRef.current.value;
    const distance = distanceRef.current.value;
    const maxGroupSize = maxGroupSizeRef.current.value;

    if (location === "" || distance === "" || maxGroupSize === "") {
      return alert("All fields are required!");
    }

    const res = await fetch(
      `${BASE_URL}/tours/search/getTourBySearch?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`
    );

    if (!res.ok) alert("Something went wrong");

    const result = await res.json();

    navigate(
      `/tours/search?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`,
      { state: result.data }
    );
  };

  const nearMeHandler = async () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported in your browser");
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `${BASE_URL}/tours/search/getNearbyTours?lat=${latitude}&lng=${longitude}&radiusKm=100`
          );
          const result = await res.json();
          if (!res.ok) {
            return alert(result.message || "Failed to fetch nearby tours");
          }
          navigate(`/tours/search?nearby=true`, { state: result.data });
        } catch (error) {
          alert("Failed to fetch nearby tours");
        }
      },
      () => alert("Unable to access your location")
    );
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
              <i class="ri-map-pin-line"></i>
            </span>
            <div>
              <h6>Location</h6>
              <input
                type="text"
                placeholder="Where are you going?"
                ref={locationRef}
              />
            </div>
          </FormGroup>
          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
              <i className="ri-map-pin-time-line"></i>
            </span>
            <div>
              <h6>Distance</h6>
              <input
                type="number"
                placeholder="Distance k/m"
                ref={distanceRef}
              />
            </div>
          </FormGroup>
          <FormGroup className="d-flex gap-3 form__group form__group-last">
            <span>
              <i class="ri-group-line"></i>
            </span>
            <div>
              <h6>Max People</h6>
              <input type="number" placeholder="0" ref={maxGroupSizeRef} />
            </div>
          </FormGroup>
          <span className="search__icon" type="submit" onClick={searchHandler}>
            <i class="ri-search-line"></i>
          </span>
          <button
            type="button"
            className="btn btn-warning text-white ms-2"
            onClick={nearMeHandler}
          >
            Near Me
          </button>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
