import './App.css';
import SnakeGame from "./SnakeGame";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home";
import MultiplayerSnakeGame from "./Multiplayer";
import {useState} from "react";

function App() {

    const [snakeNumber, setSnakeNumber] = useState(0);

    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/solo" element={<SnakeGame />} />
              <Route path="/multi" element={<MultiplayerSnakeGame snakeNumber={snakeNumber} setSnakeNumber={setSnakeNumber} />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
