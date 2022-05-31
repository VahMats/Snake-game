import React, { useEffect, useState } from "react";
import {HiArrowNarrowDown, HiArrowNarrowLeft, HiArrowNarrowRight, HiArrowNarrowUp} from "react-icons/hi";
import useKeypress from "react-use-keypress";
import io from "socket.io-client";

// const socket = io.connect("https://snakegame-multi.herokuapp.com/");
const socket = io.connect("http://localhost:3001/");

const MultiplayerSnakeGame = () => {

    const [roomEnter, setRoomEnter] = useState(false);
    const [snakeNumber, setSnakeNumber] = useState(0);
    const [room, setRoom] = useState("");
    const [readyForGame, setReadyForGame] = useState("not ready");
    const [show, setShow] = useState(true);
    const [move, setMove] = useState(null);
    const [direction, setDirection] = useState("");
    const [foodPlace, setFoodPlace] = useState({});
    const [yourSnakePlace, setYourSnakePlace] = useState([]);
    const [opponentSnakePlace, setOpponentSnakePlace] = useState([]);
    const [gameOver, setGameOver] = useState("");

    const yourSnakeColor = snakeNumber === 1 ? "bg-gray-300 border-gray-500" : "bg-yellow-300 border-yellow-500";
    const opponentSnakeColor = snakeNumber === 2 ? "bg-gray-300 border-gray-500" : "bg-yellow-300 border-yellow-500";

    useKeypress("ArrowUp", () => {
        if (direction !== "Down" && !show) {
            directionChanging('Up')
        }
    })
    useKeypress("ArrowDown", () => {
        if (direction !== "Up" && !show) {
            directionChanging('Down')
        }
    })
    useKeypress("ArrowLeft", () => {
        if (direction !== "Right" && !show) {
            directionChanging('Left')
        }
    })
    useKeypress("ArrowRight", () => {
        if (direction !== "Left" && !show) {
            directionChanging('Right')
        }
    })
    useKeypress("w", () => {
        if (direction !== "Down" && !show) {
            directionChanging('Up')
        }
    })
    useKeypress("s", () => {
        if (direction !== "Up" && !show) {
            directionChanging('Down')
        }
    })
    useKeypress("a", () => {
        if (direction !== "Right" && !show) {
            directionChanging('Left')
        }
    })
    useKeypress("d", () => {
        if (direction !== "Left" && !show) {
            directionChanging('Right')
        }
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
            setRoomEnter(true);
        });
    }

    function sendPlace (place) {
        socket.emit("send_place", {place, room})
    }

    function sendFoodPlace (place) {
        socket.emit("send_food_place", {food: place, room})
    }

    function sendStartGame () {
        socket.emit("send_ready", {message: "ready", room})
    }

    function sendGameOver (message) {
        socket.emit("send_gameOver", {message:message, room})
    }

    useEffect(()=>{
        socket.on("receive_place", (data) => {
            setOpponentSnakePlace(data.place);
        })

        socket.on("receive_food_place", (data) => {
            setFoodPlace(data.food);
        })

        socket.on("receive_ready", (data) => {
            setReadyForGame(data.message)
        })

        socket.on("receive_gameOver", (data) => {
            setGameOver(data.message);
        })
    },[socket])

    function directionChanging (newDirection) {
        move && clearInterval(move);
        setDirection(newDirection)
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

            place.push(head);
            place.shift()
            setYourSnakePlace([...place]);
            sendPlace(place);
        },200)
        if (gameOver){
            clearInterval(interval)
        } else {
            setMove(interval);
        }
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
            if (el.top > 95 || el.top < 0 || el.left > 95 || el.left < 0) {
                setGameOver("you");
                sendGameOver ("opp");
            }
        })

        opponentSnakePlace.forEach(el=>{
            if (el.top === yourSnakePlace[yourSnakePlace.length - 1].top && el.left === yourSnakePlace[yourSnakePlace.length - 1].left) {
                gameOverHandler();
            }
        })

        if (readyForGame === "ready") {
            setShow(false);
            if (snakeNumber === 1) {
                setDirection("Right")
                directionChanging("Right")
            }else {
                setDirection("Left")
                directionChanging("Left")
            }
            setReadyForGame("not ready")
        }
    })

    function gameOverHandler () {
        setGameOver("you");
        sendGameOver ("opp");
    }

    function restartTheGame () {
        setGameOver("");
        setShow(true);
        setFoodPlace({top: 45, left: 45});
        if (snakeNumber === 1) {
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
    }

    if (gameOver === "you" || gameOver === "opp") {
        clearInterval(move);
        return (
            <div className="w-full h-screen bg-[#0a192a] text-center flex text-4xl text-white font-bold justify-center items-center">
                <div className="text-center">
                    GAME OVER
                    <br/>
                    {gameOver === "you" ? 'YOU LOSE' : 'YOU WIN'}
                    <br/>
                    <button className="mt-4 w-full py-3 border border-white hover:bg-white hover:text-[#0a192a] duration-300 px-3" onClick={() => {restartTheGame()}}>Restart The Game</button>
                </div>
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
            <div className={`${roomEnter ? "" : "hidden"}`}>
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
                    {show && <button onClick={()=>{ sendStartGame(); setReadyForGame("ready") }} className="absolute top-[45%] left-[36%] w-[28%] h-[10%] bg-white text-xl font-bold">Start game</button>
                    }
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
