import React from "react";
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <div className="w-[100vw] h-screen bg-black flex justify-center items-center">
            <div className="bg-white">
                <h1>How do you want to play ?</h1>
                <div>
                    <Link to="/solo">
                        <button>Solo Snake</button>
                    </Link>
                    <Link to="/multi">
                        <button>Multi Snake</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home;
