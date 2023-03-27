import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


export default function HomePage(props) {
  const navigate = useNavigate()
    function handleLogout(e){
      localStorage.removeItem("id");
      navigate("/login")
    }
  return (
    <div>
        Hey {props.user.state.name}
        <br/>
        <Button variant='link' onClick={handleLogout}>logout</Button>
    </div>
  )
}
