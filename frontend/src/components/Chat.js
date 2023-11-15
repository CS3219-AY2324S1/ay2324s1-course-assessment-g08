import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/components/Chat.module.css";
import Draggable from "react-draggable";
import io from "socket.io-client";
function Chat(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: -440 });
  const [currentMessage, setCurrentMessage] = useState("");
  const socketRef = useRef(null);
  const buttonRef = useRef(null);
  const modalRef = useRef(null);
  const chatBoxRef = useRef(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const [messages, setMessages] = useState([]);
  const roomId = props.roomId; // This should be dynamically set based on your application logic

  useEffect(() => {
    const socketURL = process.env.REACT_APP_COMMUNICATION_SERVICE_URL;
    const path = "/communication-service/socket.io";
    socketRef.current = io(socketURL, {
      path,
      "force new connection": true,
      reconnectionAttempts: 5,
      timeout: 10000,
      transports: ["websocket"],
    }); // Assign socket instance to ref

    socketRef.current.on("connect", () => {
      console.log("Connected to the server.");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Connection failed:", error);
    });

    socketRef.current.emit("join", roomId);

    socketRef.current.on("receive-message", (message) => {
      message.type = "received";
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message);
      console.log(messages);
    });

    return () => {
      socketRef.current.off("connect");
      socketRef.current.off("connect_error");
      socketRef.current.off("receive-message");
      socketRef.current.disconnect();
    };
  }, []);
  const sendMessage = () => {
    if (!currentMessage) return; // Prevent sending empty messages
    const message = {
      type: "sent",
      text: currentMessage,
    };
    socketRef.current.emit("message", { roomId, message });
    setMessages((prevMessages) => [...prevMessages, message]);
    setCurrentMessage("");
  };
  useEffect(() => {
    if (chatBoxRef.current) {
      const { scrollHeight } = chatBoxRef.current;
      chatBoxRef.current.scrollTop = scrollHeight;
    }
  }, [messages]); // Depend on `messages` so this effect runs every time messages change.
  return (
    <div>
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={styles["chat-button"]}
      >
        Chat <span> ^ </span>
      </button>
      <Draggable position={null} scale={1} defaultPosition={position}>
        <div
          ref={modalRef}
          className={styles["chat-modal"]}
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div className={styles["button-holder"]}>
            {" "}
            <button onClick={handleClick} className={styles["close-button"]}>
              x
            </button>
          </div>

          {/* Your chat content here */}
          <div className={styles["chat-box"]} ref={chatBoxRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.type === "sent"
                    ? styles["message-sent"]
                    : styles["message-received"]
                }
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className={styles["message-input"]}>
            <input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </Draggable>
    </div>
  );
}

export default Chat;
