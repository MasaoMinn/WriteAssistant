"use client";

import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import Home from './main/home';
import Work from './main/works';
import Inspiration from './main/inspiration';
import Login from './main/login';

const Main: React.FC = () => {
  const [status, setStatus] = useState<'login' | 'work' | 'inspiration' | 'home'>('home');

  return (
    <Container fluid className="d-flex">
      <Navbar bg="light" expand="lg" className="flex-column align-items-center sidebar">
        <Container className="flex-column p-0">
          <Navbar.Brand href="./" className="w-100 text-center">Writing Assistant</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="flex-column w-100">
            <Nav className="flex-column w-100 align-items-center">
              <Nav.Link onClick={() => setStatus('home')} className="custom-nav-link">主页</Nav.Link>
              <Nav.Link onClick={() => setStatus('work')} className="custom-nav-link">我的作品</Nav.Link>
              <Nav.Link onClick={() => setStatus('inspiration')} className="custom-nav-link">灵感库</Nav.Link>
              <Nav.Link onClick={() => setStatus('login')} className="custom-nav-link">登录</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="p-4">
        {status === 'home' && <Home />}
        {status === 'work' && <Work />}
        {status === 'inspiration' && <Inspiration />}
        {status === 'login' && <Login />}
      </Container>
    </Container>
  );
};


export default Main;