import { useState } from "react";
import "./share.css";
import { createSignature } from "../services/security";


export default function Share() {

  const [imageData, setImageData] = useState()

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {setImageData(event.target.result)}
    reader.readAsDataURL(file);
    
  }
  
  async function handleShare(e){
   
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
