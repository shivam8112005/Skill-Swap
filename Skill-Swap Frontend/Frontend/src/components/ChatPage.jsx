import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';

export default function ChatPage() {
  const { roomId } = useParams();
  const username = localStorage.getItem("username"); // or context / state

  return (
    <ChatRoom roomId={roomId} username={username} />
  );
}
