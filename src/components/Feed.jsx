import Post from "./Post";
import Share from "./Share";
import "./feed.css";
import { Posts } from "../dummyData";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Feed() {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    
    async function getPosts(){
      let response = await axios.get("http://localhost:8082/api/users/GetlistOfPosts")
      console.log(response)
      setPosts(response.data)
      setLoading(false)
    }
    getPosts()

  }, [])
  console.log(posts)
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {loading && <p>loading ...</p>}
        {error && <p>could not load feed</p>}
        {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
