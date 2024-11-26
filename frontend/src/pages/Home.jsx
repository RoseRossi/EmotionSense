import React, { useEffect } from "react";
import { testBackend } from "../services/api";

const Home = () => {
  useEffect(() => {
    testBackend();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>EmotionSense</h1>
      <p>El frontend está funcionando correctamente</p>
    </div>
  );
};

export default Home;
