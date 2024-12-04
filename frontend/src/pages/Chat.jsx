import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, TextField } from "@mui/material";
import { styled } from "@mui/system";
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
  maxWidth: "600px",
  overflowY: "auto",
  padding: "16px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  marginBottom: "16px",
  alignSelf: "center", // Centrar el contenedor en la pantalla
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isChatActive, setIsChatActive] = useState(false);
  const [userInput, setUserInput] = useState("");
  const videoRef = useRef(null); // Referencia al video
  const canvasRef = useRef(null); // Referencia al canvas para capturar frames
  const inputRef = useRef(null);

  useEffect(() => {}, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleEndChat = () => {
    stopCamera();
    setIsChatActive(false);
    setMessages([]);
    setUserInput("");
  };

  const captureEmotion = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Configurar el tamaño del canvas
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Dibujar el frame actual en el canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Convertir el frame en un blob
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));

      // Enviar el blob al backend
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const response = await fetch("http://127.0.0.1:8000/detect-emotion/", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.emotion) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: `Detecté que te sientes: ${data.emotion}`, sender: "bot" },
          ]);

          // Generar un consejo basado en la emoción detectada
          generateAdvice(data.emotion);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "No pude detectar tu emoción.", sender: "bot" },
          ]);
        }
      } catch (err) {
        console.error("Error al enviar el frame:", err);
      }
    }
  };

  const generateAdvice = async (emotion) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-advice/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emotion }),
      });

      const data = await response.json();

      if (data.advice) {
        const adviceMessage = `Consejo: ${data.advice}`;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: adviceMessage, sender: "bot" },
        ]);

        // Usar TTS para leer el consejo en voz alta
        speakText(adviceMessage);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "No pude generar un consejo.", sender: "bot" },
        ]);
      }
    } catch (err) {
      console.error("Error al generar consejo:", err);
    }
  };

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "es-ES"; // Configura el idioma a español
    speech.rate = 1; // Velocidad normal
    window.speechSynthesis.speak(speech);
  };

  const handleStartChat = async () => {
    setIsChatActive(true);
    await startCamera(); // Iniciar la cámara al activar el chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: "¡Hola! Captura una emoción para continuar.", sender: "bot" },
    ]);
  };

  const handleSendMessage = useCallback(async () => {
    if (userInput.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userInput, sender: "user" },
      ]);

      // Lógica para responder al usuario en el chat
      try {
        const response = await fetch("http://127.0.0.1:8000/generate-advice/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emotion: userInput }),
        });

        const data = await response.json();
        if (data.advice) {
          const responseMessage = data.advice;
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: responseMessage, sender: "bot" },
          ]);

          // Leer la respuesta en voz alta
          speakText(responseMessage);
        }
      } catch (err) {
        console.error("Error al generar respuesta en el chat:", err);
      }

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
      <div className="chat-container" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        {isChatActive && (
          <>
            <video ref={videoRef} style={{ width: "100%", maxWidth: "600px", marginBottom: "16px" }}></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <button className="button" onClick={captureEmotion} style={{ marginBottom: "16px" }}>
              Capturar Emoción
            </button>
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
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <p style={{ margin: 0 }}>{message.text}</p>
                </div>
              ))}
            </ChatContainer>
            
          </>
        )}

        {!isChatActive && (
          <div className="card">
            <button className="button" onClick={handleStartChat}>
              Iniciar Chat
            </button>
          </div>
        )}

        {isChatActive && (
          <div className="input-container" style={{ marginTop: "16px", width: "100%", maxWidth: "600px", margin: "0 auto" }}>
            <TextField
              inputRef={inputRef}
              variant="outlined"
              placeholder="Escribe tu mensaje..."
              value={userInput}
              onChange={handleInputChange}
              fullWidth
            />
            <button className="button" onClick={handleEndChat} style={{ marginTop: "16px", backgroundColor: "red" }}>
              Finalizar Conversación
            </button>
            <button
              className="button"
              onClick={handleSendMessage}
              style={{ marginLeft: "8px" }}
            >
              Enviar
            </button>
          </div>
        )}
      </div>
    </BackgroundImage>
  );
};

export default Chat;
