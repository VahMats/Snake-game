// import "./App.css";
// import { useEffect, useState } from "react";
//
//
// function Chat() {
//
//     const [room, setRoom] = useState("");
//     const [message, setMessage] = useState("");
//     const [messageReceived, setMessageReceived] = useState("");
//     const [allMessages, setAllMessages] = useState([]);
//
//
//
//     const sendMessage = () => {
//         socket.emit("send_message", { message, room });
//         setAllMessages(prev=>[message, prev])};
//
//     useEffect(() => {
//         socket.on("receive_message", (data) => {
//             setMessageReceived(data.message);
//             setAllMessages(prev=>([data.message,prev]))
//         });
//     }, [socket]);
//
//     return (
//         <div className="w-[100vw] h-screen bg-gray-800 flex justify-center items-center">
//             <div className="bg-white flex flex-col justify-around p-8 rounded-md">
//
//                 <div className="border-2 border-blue-800 mt-4">
//                     {messageReceived.length === 0 ? <p>Start dialog with someone</p> : messageReceived}
//                 </div>
//                 <div className="border-2 border-blue-200 mt-4">
//                     <input
//                         placeholder="Message..."
//                         onChange={(event) => {
//                             setMessage(event.target.value);
//                         }}
//                     />
//                     <button className="border-2 px-2" onClick={sendMessage}> Send Message</button>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default Chat;
