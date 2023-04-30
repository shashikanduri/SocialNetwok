import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import img from "../components/sky.jpg"
import { AESEncryption } from "../services/security";
import { login } from "../services/posts";


export default function Login(){

    const emailref = useRef()
    const passref = useRef()
    
    const [loading, setLoading] = useState(false)
    const[error, setError] = useState()
    const navigate = useNavigate()
    
    async function handleSubmit(e){
        e.preventDefault();
        setError("")

        const userDataString = localStorage.getItem(emailref.current.value)
        if(!userDataString){
            return setError("no such user")
        }
        const userData = JSON.parse(userDataString)

        let data = emailref.current.value + "//" + passref.current.value
        const aesObject = await AESEncryption(data, Buffer.from(userData.dhKey,'hex'))

        let formData = {
            encryptedData: aesObject.encryptedDataBase64,
            userPublicKey: userData.dh.clientPublicKey,
            iv: aesObject.ivString
        }

        let url = "http://localhost:8080/api/users/login"
        
        let loginStatus = await login(formData, url)

        if(loginStatus.status !== 200){
            setError(loginStatus.data.message)
            console.log(loginStatus)
        }
        else{
            localStorage.setItem("sessionData", JSON.stringify(loginStatus.data))
            console.log(loginStatus)
            navigate("/")
        }
        
        setLoading(false)
                
    }
    return (
        
        <div style={{ 
            backgroundImage: `url(${img})` 
          }}>

        <Container className="d-flex align-items-center justify-content-center"
        style = {{minHeight:"100vh"}}>
            <div className="w-100" style={{maxWidth:"400px"}}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Log In</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
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
                <div className="w-100 text-center mt-2" style = {{color:'white'}}>Don't have an account? <Link to="/signup">Sign Up</Link></div>
            </div>
        </Container>
        </div>
        
    )
 }
