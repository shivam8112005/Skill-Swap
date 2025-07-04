import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ActiveBarterPage() {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBarters = async () => {
            const res = await fetch('/api/barter/active-barter', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setRequests(data.requests);
        };
        fetchBarters();
    }, []);

    const startChat = async (barterId) => {
        try {
            const res = await fetch('/api/chat/start', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ barterId })
            });
            const data = await res.json();
            if (res.ok) {
                navigate(`/chat/${data.roomId}`);
            } else {
                console.error(data.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2>Your Active Barters</h2>
            {requests.length === 0 && <p>No active barters found.</p>}
            {requests.map(barter => (
                <div key={barter._id} style={{border: '1px solid #ccc', padding: '10px', marginBottom: '10px'}}>
                    <p><strong>Sender:</strong> {barter.sender.name}</p>
                    <p><strong>Receiver:</strong> {barter.receiver.name}</p>
                    <button onClick={() => startChat(barter._id)}>
                        Chat
                    </button>
                </div>
            ))}
        </div>
    );
}
