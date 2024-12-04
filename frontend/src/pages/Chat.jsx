import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { testBackend } from "../services/api";
import "./Chat.css";
import emotionlogo from "../assets/logo.svg";

const BackgroundImage = styled(Box)({
  backgroundImage: 'url(/bg.svg)',
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const ChatContainer = styled(Box)({
  height: "200px", 
  width: "90%", // Ajuste del ancho
  maxWidth: "800px", // Ancho máximo
  overflowY: "auto", 
  padding: "16px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isChatActive, setIsChatActive] = useState(false);
  const [userInput, setUserInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    testBackend();
  }, []);

  const handleStartChat = () => {
    setIsChatActive(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: "¡Hola! ¿Cómo te sientes hoy?", sender: "bot" },
    ]);
  };

  const handleSendMessage = useCallback(() => {
    if (userInput.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userInput, sender: "user" },
      ]);
      setUserInput(""); // Limpiar el campo de texto

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [userInput]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <BackgroundImage>
      <h1>EmotionSense</h1>
      <img src={emotionlogo} className="logochat" alt="Logo emotion" />
      <div className="chat-container">
        {isChatActive && (
          <ChatContainer>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender}`}
                style={{
                  backgroundColor:
                    message.sender === "bot" ? "#8672a5" : "#f4e6fc",
                  alignSelf:
                    message.sender === "bot" ? "flex-start" : "flex-end",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  margin: "4px 0",
                  maxWidth: "70%",
                  wordWrap: "break-word", // Forzar ajuste de palabras largas
                  whiteSpace: "pre-wrap", // Mantener saltos de línea y ajustar el texto
                }}
              >
                <p style={{ margin: 0 }}>{message.text}</p>
              </div>
            ))}
          </ChatContainer>
        )}

        {isChatActive ? (
          <div className="input-container" style={{ marginTop: "16px" }}>
            <TextField
              inputRef={inputRef}
              variant="outlined"
              placeholder="Escribe tu mensaje..."
              value={userInput}
              onChange={handleInputChange}
              fullWidth
            />
            <button
              className="button"
              onClick={handleSendMessage}
            >
              Enviar
            </button>
          </div>
        ) : (
          <div className="card">
            <button className="button" onClick={handleStartChat}>
              Iniciar chat
            </button>
          </div>
        )}
      </div>
    </BackgroundImage>
  );
};

export default Chat;
