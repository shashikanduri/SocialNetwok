import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { firebaseauth } from '../firebase'
const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function ProviderAuthContext({ children }) {
  
  const [currentUser, setUser]  = useState()
  
  function signup(email, pass){
    createUserWithEmailAndPassword(firebaseauth, email, pass).then((userCredential) => {
      console.log("signup")
    })
  }

  useEffect(() => {
    const call = firebaseauth.onAuthStateChanged(user =>{
      setUser(user)
      console.log('used'+ currentUser)
    })
    return () => {
      call();
    }
  },[])

  function logout(){
    setUser("")
    console.log("logout")
    
  }

  const value = {
    currentUser,
    signup,
    logout
  }

  return <AuthContext.Provider value={value}>{children}
    </AuthContext.Provider>
  
}
