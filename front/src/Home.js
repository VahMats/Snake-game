import React from "react";
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <div className="w-[100vw] h-screen bg-[#242582] flex justify-center items-center">
            <div className="bg-white py-8 px-16">
                <h1 className="text-4xl font-bold text-[#2f2fa2]">How do you want to play ?</h1>
                <div className="flex justify-around mt-6">
                    <Link to="/solo">
                        <div className="border-blue-600 border-2 text-center text-blue-600 hover:bg-blue-600 hover:text-white duration-300 py-2 px-8">
                            <button>Solo Snake</button>
                        </div>
                    </Link>
                    <Link to="/multi">
                        <div className="border-[#f64c72] border-2 text-center text-[#f64c72] hover:bg-[#f64c72] hover:text-white duration-300 py-2 px-8">
                            <button>Multi Snake</button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home;
