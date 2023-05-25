import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-3">
      <Container>
        <Row className="footer-row">
          <Col md={4}>
            <h5>Contact Information</h5>
            <p>
              Address: 123 Main St, City, State, 12345<br />
              Phone: +1 (555) 123-4567<br />
              Email: info@example.com
            </p>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <p style={{
              display: "flex",
              justifyContent: "space-between",
              width: "10rem",
              marginTop: "2rem"
            }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>{' '}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>{' '}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
