import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function SkillPostDetail() {
  const { id } = useParams(); // get post id from URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
        console.log(id);
        
      const res = await axios.get(`http://localhost:5000/api/skill/skillpost/${id}`);
      setPost(res.data);
    };
    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="detail-view">
      <h2>Skill Post Details</h2>
      <p><strong>Type:</strong> {post.type}</p>
      <p><strong>Description:</strong> {post.skillDescription}</p>
      <p><strong>Required Skills:</strong> {post.requiredSkills}</p>
      <p><strong>Provided Skills:</strong> {post.providedSkills}</p>
      <p><strong>Barter Date:</strong> {new Date(post.barterDateTime).toLocaleString()}</p>
      <p><strong>Created By:</strong> {post.userId.name} ({post.userId.email})</p>
    </div>
  );
}

export default SkillPostDetail;
