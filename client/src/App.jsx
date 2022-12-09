import { useState } from "react";
import "./App.css";
import Home from "./Home";
import Room from "./Room";
import io from "socket.io-client";
import { useEffect } from "react";
const socket = io("http://localhost:5000");
function App() {
  const [roomid, setRoomid] = useState(null);
  const [player, setPlayer] = useState(1);
  useEffect(() => {
    if (roomid) {
      socket.emit("join-room", roomid);
      socket.on("player2-joined", () => {
        console.log("player 2 joined");
        setPlayer(2);
      });
      socket.on("room-full", () => {
        console.log("room full");

        setRoomid(null);
      });
    }
    return () => {
      socket.off("room-full");
      socket.off("player-2-joined");
    };
  }, [roomid]);
  console.log(player, "player");
  return (
    <div className='App'>
      {roomid ? (
        <Room currentPlayer={player} socket={socket} roomid={roomid} />
      ) : (
        <Home setRoomid={setRoomid} />
      )}
    </div>
  );
}

export default App;
