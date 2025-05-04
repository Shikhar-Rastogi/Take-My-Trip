import React from "react";
import ServicesCard from "./ServicesCard";
import { Col } from "reactstrap";

import weatherImg from "../assets/images/weather.png";
import guideImg from "../assets/images/guide.png";
import customizationImg from "../assets/images/customization.png";

const servicesData = [
  {
    imgUrl: weatherImg,
    title: "Calculate Weather",
    desc: "Plan smarter with real-time weather updates to ensure your trip goes smoothly, rain or shine.",
  },
  {
    imgUrl: guideImg,
    title: "Best Tour Guide",
    desc: "Explore like a local with expert guides who bring culture, history, and hidden gems to life.",
  },
  {
    imgUrl: customizationImg,
    title: "Customization",
    desc: "Tailor your journey to your preferences — from destinations to activities, every detail matters.",
  },
];
const ServicesList = () => {
  return (
    <>
      {servicesData.map((item, index) => (
        <Col lg="3" md="6" sm="12" className="mb-4" key={index}>
          <ServicesCard item={item} />
        </Col>
      ))}
    </>
  );
};

export default ServicesList;
