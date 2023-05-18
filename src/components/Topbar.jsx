import "./topbar.css";
import { useNavigate } from "react-router";

export default function Topbar() {

  const navigate = useNavigate()

  let user = localStorage.getItem("sessionData")
  console.log(user)
  
  function handleLogout(e){
    localStorage.removeItem("sessionData");
    navigate("/login")
  }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo">Social Network</span>
      </div>

      <div className="topbarRight">
        <button className="shareButton" onClick={handleLogout}>logout</button>
      </div>
      
    </div>
  );
}
