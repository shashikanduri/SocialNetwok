import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import img from "../components/sky.jpg"

export default function Signup(){
    const crypto = require('crypto')
    const emailref = useRef()
    const Buffer = require('buffer').Buffer;
    const passref = useRef()
    const passref2 = useRef()
    const fullname = useRef()
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [status, setStatus] = useState()
    
    async function handleSubmit(e){
        e.preventDefault();

        if(passref.current.value !== passref2.current.value){
            return setError("Passwords dont match");
        }

        setLoading(true);
        setError("");

        const prime = crypto.getDiffieHellman('modp15').getPrime()
        const gen = crypto.getDiffieHellman('modp15').getGenerator()

        const dh = crypto.createDiffieHellman(prime, gen);
        dh.generateKeys();

        let clientPublicKey = dh.getPublicKey('hex')
        console.log(clientPublicKey)
        localStorage.setItem("public", clientPublicKey);
        localStorage.setItem("private", dh.getPrivateKey('hex'))
        
        let url = "http://localhost:8080/api/users/getPDSKey"
        let response = await axios.get(url).catch(e => {return setError(e.response.data.message)})
        
        let serverPublicKey = response.data.message
        localStorage.setItem("pdskey",serverPublicKey)

        let key = dh.computeSecret(Buffer.from(serverPublicKey,'hex'),null,null);
        console.log(key.toString('hex'))
        
        const iv = crypto.randomBytes(16);
        const ivString = iv.toString('base64')
        console.log("iv: " + ivString)

        const cipher = crypto.createCipheriv('aes256', key.subarray(0,32), iv);
        
        let data = emailref.current.value + "//" + passref.current.value + "//" + fullname.current.value
    
        let encryptedData = cipher.update(data,'utf-8')
        //console.log("before final: " + encryptedData.toString('base64'))
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);
        //console.log("after final: " + encryptedData.toString('base64'))
        //encryptedData = Buffer.concat([iv, encryptedData, cipher.getAuthTag()]);
        console.log(encryptedData.toString('base64'))

        let formData = {
            encryptedData: encryptedData.toString('base64'),
            userPublicKey: clientPublicKey,
            iv: ivString
        }

        url = "http://localhost:8080/api/users/signup"
        
        await axios.post(url,formData)
        .then(response => {setStatus(response.data.message)})
        .catch(e => {setError(e.response.data.message)})

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
                    {status === "ok" && <Alert variant="success">Account created !</Alert>}
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
