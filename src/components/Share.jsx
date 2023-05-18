import { useState, useEffect, useRef } from "react";
import "./share.css";
import { Alert } from "react-bootstrap";

import { AESEncryption, createSignature } from "../services/security";
import { postPDS, postSN } from "../services/posts";


export default function Share() {

  let session = localStorage.getItem("sessionData")
  let sessionData = JSON.parse(session)
  let placeholder = "What's on your mind, " + sessionData.fullName + "?" 
  const [imageData, setImageData] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const imgText = useRef()

  const [share, setShare] = useState(true)

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {setImageData(event.target.result)}
    reader.readAsDataURL(file);
    console.log(imageData)
    setShare(false)
  }
  
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (showMessage) {
      timeoutId = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [showMessage]);

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

    const aesObject = await AESEncryption(imgText.current.value + "------" + imageData, Buffer.from(sessionData.sessionId,'hex'))
    const signature = await createSignature(imgText.current.value + "------" + imageData, sessionData.email)
    

    let formData = {
      encryptedImage: aesObject.encryptedDataBase64,
      rsaPublicKey: rsaPublicKey,
      imgSignature: signature,
      userId: sessionData.email,
      iv: aesObject.ivString,
    }
    
    let pdsResponse = await postPDS(formData, url)

    console.log(pdsResponse);

    if(pdsResponse.status === 200){
      
      formData = {
        digitalSignature: signature,
        email: sessionData.email,
        name: sessionData.fullName
      }
      
      let snResponse = await postSN(formData)
      setShowMessage(true)
      console.log(snResponse);
    }   
    window.location.reload(false)
    setLoading(false)
  }

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src="/assets/person/default-icon.jpg" alt="" />
          <input
            placeholder={placeholder}
            className="shareInput" ref={imgText}
            onChange={()=> {setShare(false)}}
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
      </div>
      { showMessage && <Alert variant="success">Posted</Alert>}
    </div>
  );
}
