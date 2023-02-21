
import React from 'react'

import { Navigate, redirect, useLocation } from 'react-router-dom'

import HomePage from './HomePage'

export default function Home() {
   const location = useLocation()
   const userData = location.state
    return (
        userData ? <HomePage /> : <Navigate to="/signup" />
    )
}
