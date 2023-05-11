import Post from "./Post";
import Share from "./Share";
import "./feed.css";
import { Posts } from "../dummyData";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Feed() {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios.get("http://localhost:8082/api/users/GetlistOfPosts").then((response) => {setPosts(response.data.reverse());console.log(response)}); 
  }, [])

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {loading && <p>loading ...</p>}
        {error && <p>could not load feed</p>}
        {posts.map((p) => (
          <Post key={p.url} post={p} />
        ))}
      </div>
    </div>
  );
}
