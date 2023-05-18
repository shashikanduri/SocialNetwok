import React, {useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AESEncryption, createAndComputeDHSecret, creatersakeys } from "../services/security";
import { signup, signupSN } from "../services/posts";


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
        setError(null)
        setStatus(null)
        setLoading(true)

        let email = emailref.current.value

        if(passref.current.value !== passref2.current.value){
            return setError("Passwords dont match");
        }

        setLoading(true)

        let rsakeys = await creatersakeys()
        if(!rsakeys){setLoading(false);return setError("error ins RSA")}

        let dhObject = await createAndComputeDHSecret()
        if(!dhObject){setLoading(false);return setError("error in DH")}

        let data = emailref.current.value + "//" + passref.current.value + "//" + fullname.current.value
        let aesObject = await AESEncryption(data, dhObject.key)
        if(!aesObject){setLoading(false);return setError("error in AES")}
        let key = dhObject.key.toString('hex')

        let formData = {
            encryptedData: aesObject.encryptedDataBase64,
            userPublicKey: dhObject.clientPublicKey,            
            rsaPublicKey: rsakeys.rsaPublicKey,
            iv: aesObject.ivString
        }
        
        let url = "http://localhost:8080/api/users/signup"
        
        let signupStatus = await signup(formData, url)

        if(signupStatus.status === 200){
        
            let formDataSN = {
                email: emailref.current.value,
                password: passref.current.value
            }
    
            let urlSN = "http://localhost:8082/api/users/SaveUser"
    
            let signupStatusSN = await signupSN(formDataSN, urlSN)

            if(signupStatusSN.status !== 200){
                setLoading(false)
                return setError("error in saving user to sn")
            }

            const userData = {
                email: emailref.current.value,
                rsa: rsakeys,
                dh: dhObject,
                dhKey: key
            }

            console.log(JSON.stringify(userData))
            setStatus(signupStatus.status)
            localStorage.setItem(email, JSON.stringify(userData))
        }

        setLoading(false)

    }
    return (
        <div>
        
        <Container className="d-flex align-items-center justify-content-center"
        style = {{minHeight:"100vh"}}>
        
        <div className="w-100" style={{maxWidth:"400px"}}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {status && <Alert variant="success">Account created!</Alert>}
                    {loading && <Alert>loading...</Alert>}
                    
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
