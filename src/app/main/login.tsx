"use client";
import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<LoginFormData>({ username: '', password: '' });
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      axios.post(process.env.NEXT_PUBLIC_API_URL+'/api/auth/login',{
        usernameOrEmail: loginData.username,
        password: loginData.password,
      }).then((res)=> {
        alert(res.data);
      }).catch((res)=> {
        alert(res.data);
      })
      console.log('登录数据:', loginData);
    } else {
      // 处理注册逻辑
      if (registerData.password !== registerData.confirmPassword) {
        alert('两次输入的密码不一致');
        return;
      }
      console.log('注册数据:', registerData);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="text-center mb-4">
            <h2>{isLogin ? '登录' : '注册'}</h2>
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? '没有账号？注册' : '已有账号？登录'}
            </Button>
          </div>
          
          <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>用户名</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  required
                />
              </Form.Group>

            {!isLogin &&<Form.Group className="mb-3">
              <Form.Label>邮箱</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={isLogin ? loginData.username : registerData.email}
                onChange={isLogin ? handleLoginChange : handleRegisterChange}
                required
              />
            </Form.Group>}

            <Form.Group className="mb-3">
              <Form.Label>密码</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={isLogin ? loginData.password : registerData.password}
                onChange={isLogin ? handleLoginChange : handleRegisterChange}
                required
              />
            </Form.Group>

            {!isLogin && (
              <Form.Group className="mb-3">
                <Form.Label>确认密码</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                />
              </Form.Group>
            )}

            <div className="text-center">
              <Button variant="primary" type="submit">
                {isLogin ? '登录' : '注册'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};