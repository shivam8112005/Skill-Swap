import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import VideoCall from "./VideoCall"; 

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function VideoCallPage() {
  const { roomId } = useParams();
   const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${BASE_URL}users/userprofile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setUserName(data.user.name); 
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;

   
    return <VideoCall roomID={roomId} userName={userName} />;
}
