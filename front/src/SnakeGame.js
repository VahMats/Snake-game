import React, {useEffect, useState} from "react";
import {HiArrowNarrowDown, HiArrowNarrowLeft, HiArrowNarrowRight, HiArrowNarrowUp} from "react-icons/hi";
import useKeypress from "react-use-keypress";

const SnakeGame = () => {

    const [move, setMove] = useState(null);
    const [direction, setDirection] = useState("");
    const [foodPlace, setFoodPlace] = useState({top:45, left:45});
    const [startGame, setStartGame] = useState(false);
    const [snakePlace, setSnakePlace] = useState([
        {top: 0, left: 0},
        {top: 0, left: 5},
    ]);
    const [gameOver, setGameOver] = useState(false);

    useKeypress("ArrowUp", () => {
        if (direction !== "Down" && startGame) {
            directionChanging('Up')
        }
    })
    useKeypress("ArrowDown", () => {
        if (direction !== "Up" && startGame) {
            directionChanging('Down')
        }
    })
    useKeypress("ArrowLeft", () => {
        if (direction !== "Right" && startGame) {
            directionChanging('Left')
        }
    })
    useKeypress("ArrowRight", () => {
        if (direction !== "Left" && startGame) {
            directionChanging('Right')
        }
    })
    useKeypress("w", () => {
        if (direction !== "Down" && startGame) {
            directionChanging('Up')
        }
    })
    useKeypress("s", () => {
        if (direction !== "Up" && startGame) {
            directionChanging('Down')
        }
    })
    useKeypress("a", () => {
        if (direction !== "Right" && startGame) {
            directionChanging('Left')
        }
    })
    useKeypress("d", () => {
        if (direction !== "Left" && startGame) {
            directionChanging('Right')
        }
    })

    const directionChanging = (newDirection) => {
        move && clearInterval(move)
        setDirection(newDirection)
        const place = [...snakePlace];
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
                setFoodPlace(normalPlaceForFood());
                place.unshift({});
            }
            place.push(head);
            place.shift()
            setSnakePlace([...place]);
            let newPlace = place.slice(1, place.length - 1);
            newPlace.forEach((el, index)=> {
                if (el.top === head.top && el.left === head.left) {
                    setGameOver(true)
                }
            })
        },100)
        setMove(interval);
    }

    // function recursionFood () {
    //     let place = [...snakePlace];
    //     const foodTopArg = Math.floor(Math.random() * 10) * 5;
    //     const foodLeftArg = Math.floor(Math.random() * 10) * 5;
    //     let food = {top: foodTopArg, left: foodLeftArg};
    //     place = place.filter(el=>(el.top === food.top && el.left === food.left));
    //     return place.length === 0 ? food : recursionFood();
    // }

    function normalPlaceForFood () {
        let good = false;
        let place = [...snakePlace];
        while (!good) {
            console.log("in while");
            const foodTopArg = Math.floor(Math.random() * 10) * 5;
            const foodLeftArg = Math.floor(Math.random() * 10) * 5;
            let food = {top: foodTopArg, left: foodLeftArg};
            place = place.filter(el => (el.top === food.top && el.left === food.left));
            if (place.length === 0){
                good = true
                return food
            } else {
                console.log("false food")
                good = false
            }
        }
    }

    function startTheGame () {
        directionChanging("Right");
        setDirection("Right");
        setStartGame(true);
    }

    function restartTheGame () {
        setGameOver(false);
        setSnakePlace([
            {top: 0, left: 0},
            {top: 0, left: 5},
        ])
        setFoodPlace({top: 45, left: 45});
        setStartGame(false);
    }

    useEffect(()=>{
        snakePlace.forEach(el=>{
            if (el.top > 95 || el.top < 0 || el.left > 95 || el.left < 0) setGameOver(true)
        })
    })

    if (gameOver) {
        clearInterval(move);
        return (
            <div className="w-full text-white h-screen bg-[#0a192a] flex text-4xl font-bold justify-center items-center">
                <div className="text-center">
                    <h2>GAME OVER</h2>
                    <h3>Your Score is {snakePlace.length}</h3>
                    <button className="mt-4 w-full py-3 border border-white hover:bg-white hover:text-[#0a192a] duration-300" onClick={restartTheGame}>Restart</button>
                </div>
            </div>
            )
    }

    return (
        <div className="w-full h-screen bg-[#0a192a]">
            <div>
                <div className="mx-auto top-[150px] border-red-600 border-4 w-[500px] h-[500px] relative">
                    {snakePlace.map((part, index) => {
                        return (
                            <div key={index} className="w-[5%] h-[5%] bg-gray-300 border-gray-500 border-2 absolute" style={{top: `${part.top}%`, left: `${part.left}%`}}/>
                        )
                    })}
                    <div className="w-[5%] h-[5%] bg-red-500 border-gray-500  border-2 absolute" style={{top: `${foodPlace.top}%`, left: `${foodPlace.left}%`}}/>
                    {!startGame && <button onClick={()=>{startTheGame()}} className="absolute top-[45%] left-[36%] w-[28%] h-[10%] bg-white text-xl font-bold">Start game</button>}
                </div>
            </div>
            {/*<div className="mt-56 w-full">*/}
            {/*    <div onClick={e => {*/}
            {/*        directionChanging('Up')*/}
            {/*    }}*/}
            {/*         className="mx-auto w-[60px] h-[60px] bg-gray-400 border-4 border-gray-600 hover:bg-gray-500 active:bg-gray-900 active:border-gray-300 flex justify-center items-center">*/}
            {/*        <HiArrowNarrowUp className="w-[30px] h-[30px]"/>*/}
            {/*    </div>*/}
            {/*    <div className="w-[27%] mt-6 mx-auto flex justify-center">*/}
            {/*        <div onClick={e => {*/}
            {/*            directionChanging("Left")*/}
            {/*        }}*/}
            {/*             className="mx-auto w-[60px] h-[60px] bg-gray-400 border-4 border-gray-600 hover:bg-gray-500 active:bg-gray-900 active:border-gray-300 flex justify-center items-center">*/}
            {/*            <HiArrowNarrowLeft className="w-[30px] h-[30px]"/>*/}
            {/*        </div>*/}
            {/*        <div onClick={e => {*/}
            {/*            directionChanging("Down")*/}
            {/*        }}*/}
            {/*             className="mx-auto w-[60px] h-[60px] bg-gray-400 border-4 border-gray-600 hover:bg-gray-500 active:bg-gray-900 active:border-gray-300 flex justify-center items-center">*/}
            {/*            <HiArrowNarrowDown className="w-[30px] h-[30px]"/>*/}
            {/*        </div>*/}
            {/*        <div onClick={e => {*/}
            {/*            directionChanging("Right")*/}
            {/*        }}*/}
            {/*             className="mx-auto w-[60px] h-[60px] bg-gray-400 border-4 border-gray-600 hover:bg-gray-500 active:bg-gray-900 active:border-gray-300 flex justify-center items-center">*/}
            {/*            <HiArrowNarrowRight className="w-[30px] h-[30px]"/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}

export default SnakeGame;
