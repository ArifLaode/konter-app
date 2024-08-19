import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

function Login({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://192.168.114.8:3001/api/login', { username, password });
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            navigate('/'); // Redirect ke halaman utama setelah login
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.error(err.response.data);
                setError(err.response.data);
            } else {
                console.error('Error:', err);
            }
        }
    };   

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
            <Container className="p-4 rounded bg-white shadow" style={{ maxWidth: '400px' }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Control 
                            type='text' 
                            placeholder='Username' 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Control 
                            type='password' 
                            placeholder='Password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </Form.Group>
                    <Button variant='primary' type='submit' className="w-100">Login</Button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Form>
            </Container>
        </div>
    );
}

export default Login;
