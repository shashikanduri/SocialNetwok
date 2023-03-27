
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import HomePage from './HomePage'

export default function Home() {
   
   let id = localStorage.getItem("id");
   const userData = useLocation()
    return (
        id ? <HomePage user={userData}/> : <Navigate to="/login" />
    )
}
