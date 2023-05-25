import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '../logo.svg'; // Replace with your logo

const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className='header'>
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />{' '}
          Pharmacies
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
