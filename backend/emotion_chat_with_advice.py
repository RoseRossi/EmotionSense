import cv2
from deepface import DeepFace
import requests
import pyttsx3


class EmotionChatAssistant:
    def __init__(self, groqcloud_api_key, groqcloud_endpoint="https://api.groq.com/openai/v1/chat/completions"):
        self.api_key = groqcloud_api_key
        self.endpoint = groqcloud_endpoint
        self.tts_engine = pyttsx3.init()
        self.configure_tts()  # Configuración inicial del TTS
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    def configure_tts(self):
        """
        Configura el motor de texto a voz para que suene más amigable.
        """
        voices = self.tts_engine.getProperty('voices')
        self.tts_engine.setProperty('voice', voices[0].id)  # Cambia a [1] para una voz femenina (según el sistema)
        self.tts_engine.setProperty('rate', 150)  # Ajusta la velocidad (valor normal ~200, más bajo es más lento)
        self.tts_engine.setProperty('volume', 1.0)  # Volumen máximo (entre 0.0 y 1.0)

    def speak_text(self, text):
        """
        Convierte texto en voz y lo reproduce.
        """
        self.tts_engine.say(text)
        self.tts_engine.runAndWait()

    def detectar_emocion(self, frame):
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

    def generar_consejos(self, emocion):
        """
        Genera un consejo inicial breve basado en la emoción detectada usando GroqCloud.
        """
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            prompt = f"El usuario se siente {emocion}. Por favor, proporciona un consejo breve y empático en un solo párrafo en español."

            payload = {
                "messages": [
                    {"role": "system", "content": "Eres un asistente empático que ofrece consejos útiles y concisos basados en emociones, respondiendo siempre en español."},
                    {"role": "user", "content": prompt}
                ],
                "model": "llama3-8b-8192",
                "max_tokens": 100,
                "temperature": 0.7
            }

            response = requests.post(self.endpoint, json=payload, headers=headers)

            if response.status_code == 200:
                respuesta = response.json()
                return respuesta["choices"][0]["message"]["content"]
            else:
                print(f"Error en GroqCloud API: {response.status_code} - {response.text}")
                return "Lo siento, ocurrió un problema al generar el consejo inicial."

        except Exception as e:
            print(f"Error al generar consejo: {e}")
            return "Lo siento, ocurrió un error al generar el consejo."

    def iniciar_chat(self, emocion, consejo_inicial):
        """
        Inicia un chat interactivo basado en la emoción detectada y el consejo inicial.
        """
        print(f"Asistente (basado en {emocion}): {consejo_inicial}")
        self.speak_text(consejo_inicial)
        print("Escribe 'salir' para terminar el chat.")

        mensajes = [
            {"role": "system", "content": f"Eres un asistente empático que interactúa con base en emociones. El usuario inicialmente se sentía {emocion}. Responde de forma breve y concisa en español."},
            {"role": "assistant", "content": consejo_inicial}
        ]

        while True:
            user_input = input("Tú: ")
            if user_input.lower() == "salir":
                print("¡Gracias por interactuar! Hasta luego.")
                self.speak_text("Gracias por interactuar. Hasta luego.")
                break

            mensajes.append({"role": "user", "content": user_input})

            try:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }

                payload = {
                    "messages": mensajes,
                    "model": "llama3-8b-8192",
                    "max_tokens": 100,
                    "temperature": 0.7
                }

                response = requests.post(self.endpoint, json=payload, headers=headers)

                if response.status_code == 200:
                    respuesta = response.json()["choices"][0]["message"]["content"]
                    print(f"Asistente: {respuesta}")
                    self.speak_text(respuesta)
                    mensajes.append({"role": "assistant", "content": respuesta})
                else:
                    print(f"Error en GroqCloud API: {response.status_code} - {response.text}")
                    print("Asistente: Lo siento, ocurrió un problema al generar la respuesta.")

            except Exception as e:
                print(f"Error al generar respuesta: {e}")
                print("Asistente: Lo siento, ocurrió un error al generar la respuesta.")

    def iniciar_asistente(self):
        """
        Detecta emociones, genera un consejo inicial y permite iniciar un chat interactivo.
        """
        camera = cv2.VideoCapture(0)

        if not camera.isOpened():
            print("No se pudo acceder a la cámara.")
            return

        print("Presiona 'c' para capturar la emoción y comenzar el chat, o 'q' para salir.")
        emocion_detectada = None

        while True:
            ret, frame = camera.read()
            if not ret:
                print("No se pudo capturar el frame.")
                break

            cv2.imshow("Detección de emociones", frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord('c'):
                emocion_detectada = self.detectar_emocion(frame)
                print(f"Emoción detectada: {emocion_detectada}")
                break
            if key == ord('q'):
                print("Saliendo...")
                break

        camera.release()
        cv2.destroyAllWindows()

        if emocion_detectada:
            print(f"Detectando consejos basados en la emoción: {emocion_detectada}...")
            consejo_inicial = self.generar_consejos(emocion_detectada)
            self.iniciar_chat(emocion_detectada, consejo_inicial)


# Uso del componente
if __name__ == "__main__":
    api_key = "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"
    assistant = EmotionChatAssistant(api_key)
    assistant.iniciar_asistente()
