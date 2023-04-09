import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


export default function HomePage(props) {
  const navigate = useNavigate()

  let user = localStorage.getItem("sessionData")
  console.log(user)
  
  function handleLogout(e){
    localStorage.removeItem("sessionData");
    navigate("/login")
  }

  return (
    <div>
        Hey 
        <br/>
        <Button variant='link' onClick={handleLogout}>logout</Button>
    </div>
  )
}
