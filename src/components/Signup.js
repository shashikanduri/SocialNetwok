import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import img from "../components/sky.jpg"
import { AESEncryption, createAndComputeDHSecret, creatersakeys } from "../services/security";


export default function Signup(){

    const emailref = useRef()    
    const passref = useRef()
    const passref2 = useRef()
    const fullname = useRef()
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [status, setStatus] = useState()

    async function handleSubmit(e){
        e.preventDefault();

        let email = emailref.current.value

        if(passref.current.value !== passref2.current.value){
            return setError("Passwords dont match");
        }

        setLoading(true)

        let rsakeys = await creatersakeys()
        if(!rsakeys){return setError("error ins RSA")}

        let dhObject = await createAndComputeDHSecret()
        if(!dhObject){return setError("error in DH")}

        let data = emailref.current.value + "//" + passref.current.value + "//" + fullname.current.value
        let aesObject = await AESEncryption(data, dhObject.key)
        if(!aesObject){return setError("error in AES")}
        let key = dhObject.key.toString('hex')

        let formData = {
            encryptedData: aesObject.encryptedDataBase64,
            userPublicKey: dhObject.clientPublicKey,
            rsaPublicKey: rsakeys.rsaPublicKey,
            iv: aesObject.ivString
        }
        
        let url = "http://localhost:8080/api/users/signup"
        
        await axios.post(url,formData)
        .then(response => {setStatus(response.status)})
        .catch(e => {setError(e.response.data.message)})

        if(status === 200){

            const userData = {
                email: emailref.current.value,
                rsa: rsakeys,
                dh: dhObject,
                dhKey: key
            }

            localStorage.setItem(email, JSON.stringify(userData))
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
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {status && <Alert variant="success">Account created!</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailref} required />
                        </Form.Group>

                        <Form.Group id="fullname">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" ref={fullname} required />
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passref} required />
                        </Form.Group>

                        <Form.Group id="confirmpassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={passref2} required />
                        </Form.Group>

                        <br/>
                        <Button disabled={loading} className="w-100" type="submit" >
                            Sign Up
                        </Button>
                        
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2" style = {{color:'white'}}>Already have an account? <Link to="/login">Log In</Link></div>
        </div>
        
        </Container>
        

        </div>
        
    )
 }
