import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import img from "../components/sky.jpg"
import { AESEncryption, createSignature } from "../services/security";
import {pki,util,md} from "node-forge";

export default function Login(){
   const crypto = require('crypto')

    const emailref = useRef()
    const passref = useRef()

    
    const [loading, setLoading] = useState(false)
    const[error, setError] = useState()
    const navigate = useNavigate()
    
    async function handleSubmit(e){
        e.preventDefault();
        setError("")
        
        const prime = crypto.getDiffieHellman('modp15').getPrime()
        const gen = crypto.getDiffieHellman('modp15').getGenerator()

        const userDataString = localStorage.getItem(emailref.current.value)
        const userData = JSON.parse(userDataString)

        let publicKey = userData.dh.clientPublicKey
        let privateKey = userData.dh.clientPrivateKey
        let pdskey = userData.dh.serverPublicKey
        

        const dh = crypto.createDiffieHellman(prime, gen);
        dh.setPublicKey(Buffer.from(publicKey,'hex'))
        dh.setPrivateKey(Buffer.from(privateKey,'hex'))
        let key = dh.computeSecret(Buffer.from(pdskey,'hex'))

        
        let data = emailref.current.value + "//" + passref.current.value
        const aesObject = await AESEncryption(data, key)

        let formData = {
            encryptedData: aesObject.encryptedDataBase64,
            userPublicKey: publicKey,
            iv: aesObject.ivString
        }

        let url = "http://localhost:8080/api/users/login"
        
        await axios.post(url,formData)
        .then(response => {
            if(response.status !== 200){
                setError(response.data.message)
                console.log(response)
            }
            else{
                localStorage.setItem("sessionData",JSON.stringify(response.data))
                console.log(response)
                navigate("/")
            }
        })
        .catch(e => {setError(e.response)})
        
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
