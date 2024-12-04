import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { testBackend } from "../services/api";
import "./Home.css";
import emotionlogo from "../assets/logo.svg";

const Home = () => {
  useEffect(() => {
    testBackend();
  }, []);

const navigate = useNavigate();
const [isDarkMode, setIsDarkMode] = useState(false);

const handleClick = () => {
  navigate('/Chat'); 
};

const toggleTheme = () => {
  setIsDarkMode((prevMode) => !prevMode);
};

const BackgroundImage = styled(Box)({
  backgroundImage:`url(${isDarkMode ? "/bgdark.svg" : "/bg.svg"})`, 
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: isDarkMode ? "#fff" : "#000",
  transition: "color 0.3s, background-image 0.3s",
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
        <button class="button" onClick={handleClick}>
          Empezar
        </button>
      </div>
      <p className="under-text">
        Tu rostro nos habla, nosotros te respondemos.
      </p>
      <button className="theme-toggle" onClick={toggleTheme}>
          Cambiar a {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
      </button>
    </BackgroundImage>
    </>
  );
};

export default Home;
