import { useState } from "react";
import "./share.css";
import axios from "axios";

import { AESEncryption, createSignature } from "../services/security";


export default function Share() {

  const [imageData, setImageData] = useState()
  const [error, setError] = useState()
  const [status, setStatus] = useState()
  const [loading, setLoading] = useState()

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {setImageData(event.target.result)}
    reader.readAsDataURL(file);
    
  }
  
  async function handleShare(e){

    setLoading(true)
    
    let session = localStorage.getItem("sessionData")
    const sessionData = JSON.parse(session)
    const userDataString = localStorage.getItem(sessionData.email)
    const userData = JSON.parse(userDataString) 
    
    let rsaPublicKey = userData.rsa.rsaPublicKey
    rsaPublicKey = rsaPublicKey.replace("-----BEGIN PUBLIC KEY-----","")
    rsaPublicKey = rsaPublicKey.replace("-----END PUBLIC KEY-----","")
    rsaPublicKey = rsaPublicKey.replaceAll("\n","")
    rsaPublicKey = rsaPublicKey.replaceAll("\r","")

    let url = "http://localhost:8080/api/posts/savepost"

    const aesObject = await AESEncryption(imageData, Buffer.from(sessionData.sessionId,'hex'))
    const signature = await createSignature(imageData, sessionData.email)
    
    let formData = {
      encryptedImage: aesObject.encryptedDataBase64,
      rsaPublicKey: rsaPublicKey,
      imgSignature: signature,
      userId: sessionData.email,
      iv: aesObject.ivString,
      caption: "shashi"
    }

    await axios.post(url,formData)
    .then(response => {
        setStatus(response.status)
        if(response.status !== 200){
            setError(response.data.message)
            console.log(response)
            setLoading(false)
        }
        else{
            console.log(response)
        }
    })
    .catch(e => {setError(e.response)})

    if(!loading){
      return setError("save error")
    }

    formData = {
      digitalSignature: "postUkjwehfgiuwerl",
      email: sessionData.email
    }

    url = "http://localhost:8082/api/users/SavePost"
    
    console.log(status)
    if(status === 200){
      await axios.post(url,formData)
      .then(response => {
          setStatus(response.status)
          if(response.status !== 200){
              setError(response.data.message)
              console.log(response)
              setLoading(false)
          }
          else{
              console.log(response)
          }
      })
      .catch(e => {setError(e.response)})
    }
    
    setLoading(false)

  }

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src="/assets/person/1.png" alt="" />
          <input
            placeholder="What's on your mind Shashi?"
            className="shareInput"
          />
        </div>
        <hr className="shareHr"/>
        <div className="shareBottom">
            <div className="shareOptions">
                <div className="shareOption">
                    <input className="shareOptionText" type="file" onChange={handleFileUpload}/>
                </div>
            </div>
            <button className="shareButton" onClick={handleShare}>Share</button>
        </div>

      </div>
    </div>
  );
}
