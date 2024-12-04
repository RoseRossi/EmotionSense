import React, { useEffect } from "react";
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { testBackend } from "../services/api";
import "./Home.css";
import emotionlogo from "../assets/logo.svg";

const Chat = () => {
  useEffect(() => {
    testBackend();
  }, []);

const BackgroundImage = styled(Box)({
  backgroundImage: 'url(/bg.svg)', 
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

  return (
    <>
    <BackgroundImage>
      <h1>EmotionSense</h1>
      <img src={emotionlogo} className="logo" alt="Logo emotion" />
      <div>
        <p>
          Te damos la bienvenida a EmotionSense. Haz click en el botón de abajo para empezar.
        </p>
        <button class="button">
          Empezar
        </button>
      </div>
      <p className="under-text">
        Tu rostro nos habla, nosotros te respondemos.
      </p>
    </BackgroundImage>
    </>
  );
};

export default Chat;
