import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import styles from "../styles/components/AiChat.module.css";
import Markdown from "marked-react";

function AiChat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatVisible, setChatVisible] = useState(false);
  const [isAwaitingReply, setIsAwaitingReply] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever chatHistory changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);
  // Function to disable dragging
  const disableDragging = () => {
    setIsDraggable(false);
  };

  // Function to enable dragging
  const enableDragging = () => {
    setIsDraggable(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents the default action of inserting a new line
      handleChat();
    }
  };
  const handleChat = async () => {
    try {
      const userMessage = { role: "user", content: message };
      setChatHistory((prevHistory) => [...prevHistory, userMessage]);
      setMessage("");
      setIsAwaitingReply(true);

      const response = await axios.post(`${process.env.REACT_APP_AI_SERVICE_URL}/ai-service/chatgpt`, {
        messages: chatHistory.concat(userMessage),
      });

      setIsAwaitingReply(false);
      const systemReply = {
        role: "system",
        content: response.data.reply.content,
      };
      setChatHistory((prevHistory) => [...prevHistory, systemReply]);
    } catch (error) {
      console.error(error);
      setIsAwaitingReply(false);
    }
  };

  const toggleChatVisibility = () => {
    setChatVisible((prev) => !prev);
  };

  if (!isChatVisible) {
    return <button onClick={toggleChatVisibility}>AI Assistant ^ </button>;
  }

  return (
    <div className={styles.overlay}>
      <Draggable disabled={!isDraggable}>
        <div className={styles["chat-container"]}>
          <div className={styles.header} onMouseDown={enableDragging}>
            <span className={styles.title}>Chat Bot</span>
            <button
              className={styles["close-btn"]}
              onClick={toggleChatVisibility}
            >
              &times;
            </button>
          </div>
          <div onMouseDown={disableDragging}>
            {chatHistory.map((msg, index) => (
              <p key={index} className={styles[msg.role]}>
                {msg.role === "user" ? "You: " : "System: "}
                <Markdown>{msg.content}</Markdown>
              </p>
            ))}
            {isAwaitingReply && (
              <p className={styles.system}>System: Please wait...</p>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles["message-input"]}>
            <textarea
              className={styles["textarea-field"]}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            ></textarea>
            <button className={styles["send-btn"]} onClick={handleChat}>
              Send
            </button>
          </div>
        </div>
      </Draggable>
    </div>
  );
}

export default AiChat;
