import React, {useEffect, useState} from "react";
import io from "socket.io-client";
import {Link} from "react-router-dom";

const socket = io.connect("http://localhost:3001");


const Room = ({ snakeNumber, setSnakeNumber }) => {
    const [room, setRoom] = useState("");


    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", room);
        }
        socket.on("receive_message", (data) => {
            setSnakeNumber(data)
        });
    };

    return(
        <div className="w-full h-screen bg-[#0a194d] flex justify-center items-center">
            <div className="border-b-2 border-black bg-white w-[450px] mx-auto flex justify-between px-4 py-2 items-center">
                <input
                    placeholder="Room Number..."
                    onChange={(event) => {
                        setRoom(event.target.value);
                    }}
                />
                <button className="border-2 px-2" onClick={joinRoom}> Join Room</button>
                <Link to="/multi"><button className="border ml-2">You are {snakeNumber} player, Join the game</button></Link>
            </div>
        </div>
    )
}

export default Room;
