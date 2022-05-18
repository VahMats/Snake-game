import React, { useEffect, useState } from "react";
import {HiArrowNarrowDown, HiArrowNarrowLeft, HiArrowNarrowRight, HiArrowNarrowUp} from "react-icons/hi";
import useKeypress from "react-use-keypress";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

const MultiplayerSnakeGame = () => {

    const [startGame, setStartGame] = useState(false);
    const [snakeNumber, setSnakeNumber] = useState(0);
    const [room, setRoom] = useState("");
    const [move, setMove] = useState(null);
    const [foodPlace, setFoodPlace] = useState({});
    const [yourSnakePlace, setYourSnakePlace] = useState([]);
    const [opponentSnakePlace, setOpponentSnakePlace] = useState([]);
    const [gameOver, setGameOver] = useState("");

    const yourSnakeColor = snakeNumber === 1 ? "bg-gray-300 border-gray-500" : "bg-yellow-300 border-yellow-500";
    const opponentSnakeColor = snakeNumber === 2 ? "bg-gray-300 border-gray-500" : "bg-yellow-300 border-yellow-500";

    useKeypress("ArrowUp", () => {
        directionChanging('Up')
    })
    useKeypress("ArrowDown", () => {
        directionChanging('Down')
    })
    useKeypress("ArrowLeft", () => {
        directionChanging('Left')
    })
    useKeypress("ArrowRight", () => {
        directionChanging('Right')
    })

    function joinRoom () {
        if (room !== "") {
            socket.emit("join_room", room);
        }
        socket.on("receive_message", (data) => {
            setSnakeNumber(data.numOfClient)
            setFoodPlace(data.food)
            if (data.numOfClient === 1) {
                setYourSnakePlace([
                    {top: 0, left: 0},
                    {top: 0, left: 5},
                ])
                setOpponentSnakePlace([
                    {top: 95, left: 95},
                    {top: 95, left: 90},
                ])
            } else {
                setOpponentSnakePlace([
                    {top: 0, left: 0},
                    {top: 0, left: 5},
                ])
                setYourSnakePlace([
                    {top: 95, left: 95},
                    {top: 95, left: 90},
                ])
            }
            setStartGame(true);
        });
    }

    function sendPlace (place) {
        socket.emit("send_place", {place, room})
    }

    function sendFoodPlace (place) {
        socket.emit("send_food_place", {food: place, room})
    }

    function sendGameOver (message) {
        socket.emit("send_gameOver", {message:message, room})
    }

    useEffect(()=>{
        socket.on("receive_place", (data) => {
            setOpponentSnakePlace(data.place)
        })

        socket.on("receive_food_place", (data) => {
            setFoodPlace(data.food)
        })

        socket.on("receive_gameOver", (data) => {
            setGameOver(data.message)
        })
    },[socket])

    const directionChanging = (newDirection) => {
        move && clearInterval(move)
        const place = [...yourSnakePlace];
        const interval = setInterval(function () {
            const head = {...place[place.length - 1]};
            switch (newDirection) {
                case "Up" : {
                    head.top -= 5;
                    break;
                }
                case "Down" : {
                    head.top += 5;
                    break;
                }
                case "Left" : {
                    head.left -= 5;
                    break;
                }
                case "Right" : {
                    head.left += 5;
                    break;
                }
            }
            if (head.top === foodPlace.top && head.left === foodPlace.left) {
                const newFoodPlace = {...recursionFood()};
                setFoodPlace(newFoodPlace);
                sendFoodPlace(newFoodPlace);
                place.unshift({});
            }

            yourSnakePlace.forEach((el, index)=> {
                if (index !== place.length - 1 && el.top === head.top && el.left === head.left) {
                    setGameOver("you");
                    sendGameOver ("opp");
                }
            })

            opponentSnakePlace.forEach(el=>{
                if (el.top === head.top && el.left === head.left) {
                    setGameOver("you");
                    sendGameOver ("opp");
                }
            })

            place.push(head);
            place.shift()
            setYourSnakePlace([...place]);
            sendPlace(place);
        },200)
        setMove(interval);
    }

    function recursionFood () {
        let yourSnake = [...yourSnakePlace];
        let opponentSnake = [...opponentSnakePlace];
        const foodTopArg = Math.floor(Math.random() * 10) * 5;
        const foodLeftArg = Math.floor(Math.random() * 10) * 5;
        let food = {top: foodTopArg, left: foodLeftArg};
        yourSnake = yourSnake.filter(el=>(el.top === food.top && el.left === food.left));
        opponentSnake = opponentSnake.filter(el=>(el.top === food.top && el.left === food.left));
        return yourSnake.length === 0 && opponentSnake.length === 0 ? food : recursionFood();
    }



    useEffect(()=>{
        yourSnakePlace.forEach(el=>{
            if (el.top > 100 || el.top < 0 || el.left > 100 || el.left < 0) {
                setGameOver("you");
                sendGameOver ("opp");
            }
        })
    })

    if (gameOver === "you" || gameOver === "opp") {
        return (
            <div className="w-full h-screen bg-[#0a192a] text-center flex text-4xl text-white font-bold justify-center items-center">
                GAME OVER
                <br/>
                {gameOver === "you" ? 'YOU LOSE' : 'YOU WIN'}
            </div>
        )
    }

    return (
        <div className="w-full h-screen bg-[#0a194d] relative">
            <div className="absolute top-10 left-0 right-0 border-b-2 border-black bg-white w-[450px] mx-auto flex justify-between px-4 py-2 items-center">
                <input
                    placeholder="Room Number..."
                    onChange={(event) => {
                        setRoom(event.target.value);
                    }}
                />
                <button className="border-2 px-2" onClick={joinRoom}> Join Room</button>
                <div className="border ml-2">{room ? `You are ${snakeNumber === 1 ? "Gray" : "Yellow"} player` : 'Waiting you or other player'}</div>
            </div>
            <div className={`${startGame ? "" : "hidden"}`}>
                <div>
                <div className="mx-auto top-[150px] border-red-600 border-4 w-[500px] h-[500px] relative">
                    {yourSnakePlace && yourSnakePlace.map((part, index) => {
                        return (
                            <div key={index} className={`w-[5%] h-[5%] border-2 absolute ${yourSnakeColor}`}
                                 style={{top: `${part.top}%`, left: `${part.left}%`}}></div>
                        )
                    })}
                    {opponentSnakePlace && opponentSnakePlace.map((part, index) => {
                        return (
                            <div key={index} className={`w-[5%] h-[5%] border-2 absolute ${opponentSnakeColor}`}
                                 style={{top: `${part.top}%`, left: `${part.left}%`}}></div>
                        )
                    })}
                    <div className="w-[5%] h-[5%] bg-red-500 border-gray-500  border-2 absolute"
                         style={{top: `${foodPlace.top}%`, left: `${foodPlace.left}%`}}></div>
                </div>
            </div>
            {/*<div className="mt-56 w-full">*/}
            {/*    <div onClick={e => {*/}
            {/*        directionChanging('Up', 'your')*/}
            {/*    }}*/}
            {/*         className="mx-auto w-[60px] h-[60px] bg-gray-400 border-4 border-gray-600 hover:bg-gray-500 active:bg-gray-900 active:border-gray-300 flex justify-center items-center">*/}
            {/*        <HiArrowNarrowUp className="w-[30px] h-[30px]"/>*/}
            {/*    </div>*/}
            {/*    <div className="w-[27%] mt-6 mx-auto flex justify-center">*/}
            {/*        <div onClick={e => {*/}
            {/*            directionChanging("Left", 'your')*/}
            {/*        }}*/}
            {/*             className="mx-auto w-[60px] h-[60px] bg-gray-400 border-4 border-gray-600 hover:bg-gray-500 active:bg-gray-900 active:border-gray-300 flex justify-center items-center">*/}
            {/*            <HiArrowNarrowLeft className="w-[30px] h-[30px]"/>*/}
            {/*        </div>*/}
            {/*        <div onClick={e => {*/}
            {/*            directionChanging("Down", 'your')*/}
            {/*        }}*/}
            {/*             className="mx-auto w-[60px] h-[60px] bg-gray-400 border-4 border-gray-600 hover:bg-gray-500 active:bg-gray-900 active:border-gray-300 flex justify-center items-center">*/}
            {/*            <HiArrowNarrowDown className="w-[30px] h-[30px]"/>*/}
            {/*        </div>*/}
            {/*        <div onClick={e => {*/}
            {/*            directionChanging("Right", 'your')*/}
            {/*        }}*/}
            {/*             className="mx-auto w-[60px] h-[60px] bg-gray-400 border-4 border-gray-600 hover:bg-gray-500 active:bg-gray-900 active:border-gray-300 flex justify-center items-center">*/}
            {/*            <HiArrowNarrowRight className="w-[30px] h-[30px]"/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
        </div>
    )
}

export default MultiplayerSnakeGame;
