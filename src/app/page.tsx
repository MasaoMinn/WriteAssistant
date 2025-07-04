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
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="./">Writing Assistant</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setStatus('home')}>主页</Nav.Link>
              <Nav.Link onClick={() => setStatus('work')}>我的作品</Nav.Link>
              <Nav.Link onClick={() => setStatus('inspiration')}>灵感库</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link onClick={() => setStatus('login')}>登录/注册</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        {status === 'home' && <Home />}
        {status === 'work' && <Work />}
        {status === 'inspiration' && <Inspiration />}
        {status === 'login' && <Login />}
      </Container>
    </>
  );
};


export default Main;