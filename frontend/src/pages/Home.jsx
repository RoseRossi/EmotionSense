import React, { useEffect } from "react";
import { Box } from '@mui/material';
import { styled } from '@mui/system';


import { testBackend } from "../services/api";
import "./Home.css";
import emotionlogo from "../assets/emotionlogo.svg";
import bg from "../assets/bg.svg";

const Home = () => {
  useEffect(() => {
    testBackend();
  }, []);

const BackgroundImage = styled(Box)({
  backgroundImage: 'url(/src/assets/bg.svg)', 
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
      <div className="cardLand">
        <p>
          Welcome to your personal emocional assistant. Click on the button down below to start your journal.
        </p>
        <button>
          Start
        </button>
      </div>
      <p className="under-text">
        We see and we care.
      </p>
    </BackgroundImage>
    </>
  );
};

export default Home;
