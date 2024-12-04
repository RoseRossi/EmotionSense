from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from emotion_chat_with_advice import EmotionChatAssistant
import numpy as np
import cv2

# Configurar FastAPI
app = FastAPI()

# Permitir CORS para conectar con el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia "*" por la URL del frontend en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar la clase del asistente
api_key = "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"
assistant = EmotionChatAssistant(api_key)

@app.post("/detect-emotion/")
async def detect_emotion(file: UploadFile = File(...)):
    """
    Endpoint para detectar emociones a partir de una imagen enviada desde el frontend.
    """
    try:
        # Leer la imagen desde el archivo
        file_bytes = await file.read()
        nparr = np.frombuffer(file_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Detectar la emoción
        emocion = assistant.detectar_emocion(frame)
        return {"emotion": emocion}
    except Exception as e:
        return {"error": f"Error detectando emoción: {str(e)}"}


class EmotionRequest(BaseModel):
    emotion: str

@app.post("/generate-advice/")
async def generate_advice(request: EmotionRequest):
    """
    Endpoint para generar un consejo basado en la emoción detectada.
    """
    try:
        consejo = assistant.generar_consejos(request.emotion)
        return {"advice": consejo}
    except Exception as e:
        return {"error": f"Error generando consejo: {str(e)}"}
