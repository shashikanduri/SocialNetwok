
import React from 'react'
import { Navigate } from 'react-router-dom'
import Profile from './Profile';


export default function Home() {
   
   let user = localStorage.getItem("sessionData")
    
    return (
        user ? <Profile /> : <Navigate to="/login" />
    )
}
