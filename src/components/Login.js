import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";
export default function Login(){
    const emailref = useRef()
    const passref = useRef()
    const passref2 = useRef()
    
    const [loading, setLoading] = useState(false)
    const[error, setError] = useState()
    const navigate = useNavigate()
    function handleSubmit(e){
        e.preventDefault();
        
    }
    return (
        <>
        <Container className="d-flex align-items-center justify-content-center"
        style = {{minHeight:"100vh"}}>
            <div className="w-100" style={{maxWidth:"400px"}}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Log In</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailref} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passref} required />
                            </Form.Group>
                            <br/>
                            <Button disabled={loading} className="w-100" type="submit" >
                                Log In
                            </Button>
                            
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">Don't have an account? <Link to="/signup">Sign Up</Link></div>
            </div>
        </Container>
        </>
        
    )
 }
