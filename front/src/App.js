import './App.css';
import SnakeGame from "./SnakeGame";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Chat from "./Chat";
import Home from "./Home";
import MultiplayerSnakeGame from "./Multiplayer";
import Room from "./Room";
import {useState} from "react";

function App() {

    const [snakeNumber, setSnakeNumber] = useState(0);

    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/solo" element={<SnakeGame />} />
              <Route path="/room" element={<Room snakeNumber={snakeNumber} setSnakeNumber={setSnakeNumber} />} />
              <Route path="/multi" element={<MultiplayerSnakeGame snakeNumber={snakeNumber} setSnakeNumber={setSnakeNumber} />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
