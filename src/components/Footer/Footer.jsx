import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { URL, fetchLogo } from "../handle_api";
import "./style.css";

const Footer = () => {
  const [logo, setLogo] = useState([]);

  useEffect(() => {
    fetchLogo().then((res) => {
      setLogo(res);
    });
  }, []);

  return (
    <footer className="new-footer">
      <Container>
        <Row className="footer-row justify-content-between align-items-center">
          {/* Logo Section */}
          <Col md={3} sm={6} xs={12} className="footer-col">
            <div className="footer-logo">
              <img
                src={`${URL}/images/${logo[0]?.image}`}
                alt="Company Logo"
                className="logo-img"
              />
            </div>
          </Col>

          {/* Quick Links */}
          {/* <Col md={3} sm={6} xs={12} className="footer-col">
            <ul className="footer-links">
              <li>
                <a href="/terms">Terms & Conditions</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
            </ul>
          </Col> */}

          {/* Copyright */}
          <Col md={3} sm={6} xs={12} className="footer-col text-md-end">
            <p>© 2024 Warehouse, All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
