import "./post.css";
import { useState } from "react";
import "./share.css"
import { getpost } from "../services/posts";
import { AESDecryption } from "../services/security";

export default function Post({ post }) {

  const [show, setShow] = useState(false)
  const [imageData, setImageData] = useState()
  const [viewButton, setViewButton] = useState(true)


  async function viewPost(e){

    let session = localStorage.getItem("sessionData")
    let sessionData = JSON.parse(session)

    let response = await getpost(post.url,sessionData.email)
    
    let data = AESDecryption(response.data.encryptedImg, response.data.iv, Buffer.from(sessionData.sessionId,'hex'))
    //console.log(response)
    setImageData(data)
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
              src="assets/person/1.png"
              alt=""
            />
            <span className="postUsername">
              {post.email}
            </span>            
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {viewButton && <button type="button" className="shareButton" onClick={viewPost} >View Post</button>}
          {show && <img src={imageData} style={{ width: "100%", height: "100%" }} alt="" />}
        </div>
      </div>
    </div>
  );
}
