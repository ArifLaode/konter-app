import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem('token');
    
    // Redirect ke halaman login atau halaman lain setelah logout
    navigate('/login');
  };
  return (
    <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">KonterApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/">
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/pulsa">
                            <Nav.Link>Stok Pulsa</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    <Button variant="outline-danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  );
};

export default NavigationBar;
