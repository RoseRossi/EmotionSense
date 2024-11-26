import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000", // URL del backend
});

export const testBackend = async () => {
  try {
    const response = await API.get("/");
    console.log(response.data);
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
  }
};
