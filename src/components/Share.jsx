import { useState } from "react";
import "./share.css";
import axios from "axios";

import { AESEncryption, createSignature } from "../services/security";
import { postPDS, postSN } from "../services/posts";


export default function Share() {

  const [imageData, setImageData] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const [share, setShare] = useState(true)

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {setImageData(event.target.result)}
    reader.readAsDataURL(file);
    setShare(false)
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
      caption: "cd"
    }
    
    let pdsResponse = await postPDS(formData, url)

    console.log(pdsResponse);

    if(pdsResponse.status === 200){
      
      formData = {
        digitalSignature: signature,
        email: sessionData.email
      }
      
      let snResponse = await postSN(formData)

      console.log(snResponse);
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
            <button disabled={share} type="button" onClick={handleShare} className="shareButton" >Share</button>
        </div>
      {error && <p>{error}</p>}
      </div>
    </div>
  );
}
