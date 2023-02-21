import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


export default function HomePage(props) {
  const navigate = useNavigate()
    function handleLogout(e){
        navigate("/login")
    }
  return (
    <div>
        Home Page
        <Button variant='link' onClick={handleLogout}>logout</Button>
    </div>
  )
}
