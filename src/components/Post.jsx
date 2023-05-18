import "./post.css";
import { useState } from "react";
import "./share.css"
import { getpost } from "../services/posts";
import { AESDecryption } from "../services/security";

export default function Post({ post }) {

  const [show, setShow] = useState(false)
  const [imageData, setImageData] = useState()
  const [viewButton, setViewButton] = useState(true)
  const [imgText, setImgText] = useState()

  async function viewPost(e){

    let session = localStorage.getItem("sessionData")
    let sessionData = JSON.parse(session)

    let response = await getpost(post.digitalSignature,sessionData.email)
    
    let data = AESDecryption(response.data.encryptedImg, response.data.iv, Buffer.from(sessionData.sessionId,'hex'))
    //console.log(response)
    setImgText(data.split("------")[0])
    setImageData(data.split("------")[1])
    setShow(true)
    setViewButton(false)
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postProfileImg"
              src="assets/person/default-icon.jpg"
              alt=""
            />
            <span className="postUsername">
              {post.name}
            </span>            
          </div>
        </div>   
        {imgText && <span className="postText">{imgText}</span> }
        <div className="postCenter">
          {viewButton && <button type="button" className="shareButton" onClick={viewPost} >View Post</button>}
          {show && <img className="postImg" src={imageData}  alt="" />}
        </div>
      </div>
    </div>
  );
}
