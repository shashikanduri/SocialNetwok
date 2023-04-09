import "./profile.css";
import Topbar from "./Topbar";
import Feed from "./Feed";

export default function Profile() {
  return (
    <>
      <Topbar />
      <div className="profile">        
        <div className="profileRight">
          <div className="profileRightBottom">
            <Feed />            
          </div>
        </div>
      </div>
    </>
  );
}
