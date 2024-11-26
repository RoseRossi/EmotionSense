import cv2
from deepface import DeepFace
import requests

# Configuración de GroqCloud
GROQCLOUD_API_KEY = "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"
GROQCLOUD_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"  # Ajusta si el endpoint es diferente

# Cargar Haar Cascade para detección de rostros
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def detectar_emocion(frame):
    """
    Detecta emociones usando DeepFace.
    """
    try:
        rostro_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        resultado = DeepFace.analyze(rostro_rgb, actions=["emotion"], detector_backend="opencv", enforce_detection=False)
        if isinstance(resultado, list):
            resultado = resultado[0]
        emocion = resultado.get("dominant_emotion", "No detectada")
        return emocion
    except Exception as e:
        print(f"Error al detectar emoción: {e}")
        return "Error al detectar emoción"

def generar_consejos_groqcloud(emocion):
    """
    Genera consejos usando Llama en GroqCloud según la emoción detectada.
    """
    try:
        headers = {
            "Authorization": f"Bearer {GROQCLOUD_API_KEY}",
            "Content-Type": "application/json"
        }

        # Prompt para GroqCloud
        prompt = f"El usuario se siente {emocion}. Por favor, dale consejos útiles y empáticos basados en esta emoción."

        payload = {
            "messages": [
                {"role": "system", "content": "Eres un asistente empático que ofrece consejos basados en emociones."},
                {"role": "user", "content": prompt}
            ],
            "model": "llama3-8b-8192",  # Cambia al modelo correcto si es diferente
            "max_tokens": 300,
            "temperature": 0.7
        }

        print("Enviando datos a GroqCloud...")
        response = requests.post(GROQCLOUD_ENDPOINT, json=payload, headers=headers)

        if response.status_code == 200:
            respuesta = response.json()
            return respuesta["choices"][0]["message"]["content"]
        else:
            print(f"Error en GroqCloud API: {response.status_code} - {response.text}")
            return "Lo siento, ocurrió un problema al generar los consejos."

    except Exception as e:
        print(f"Error al generar consejos: {e}")
        return "Lo siento, ocurrió un error al generar los consejos."

def chat_con_consejos():
    """
    Captura emociones con la cámara y genera consejos según la emoción detectada.
    """
    # Inicializar la cámara
    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        print("No se pudo acceder a la cámara.")
        return

    print("Presiona 'c' para capturar la emoción y generar consejos, o 'q' para salir.")
    emocion_detectada = None

    while True:
        ret, frame = camera.read()
        if not ret:
            print("No se pudo capturar el frame.")
            break

        cv2.imshow("Detección de emociones", frame)

        # Captura de teclado
        key = cv2.waitKey(1) & 0xFF
        if key == ord('c'):  # Captura la emoción
            emocion_detectada = detectar_emocion(frame)
            print(f"Emoción detectada: {emocion_detectada}")
            break
        if key == ord('q'):  # Salir
            print("Saliendo...")
            break

    # Liberar la cámara y cerrar ventanas
    camera.release()
    cv2.destroyAllWindows()

    # Generar consejos si se detectó una emoción
    if emocion_detectada:
        print(f"Generando consejos para la emoción: {emocion_detectada}...")
        consejos = generar_consejos_groqcloud(emocion_detectada)
        print(f"Asistente: {consejos}")

if __name__ == "__main__":
    chat_con_consejos()
