import cv2
from deepface import DeepFace

# Cargar Haar Cascade para detección de rostros
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def analizar_emocion_con_camara():
    """
    Captura frames de la cámara en tiempo real, analiza emociones
    y las imprime en la consola.
    """
    # Inicializa la cámara
    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        print("No se pudo acceder a la cámara.")
        return

    print("Presiona 'q' para salir.")
    while True:
        ret, frame = camera.read()
        if not ret:
            print("No se pudo capturar el frame.")
            break

        # Convertir a escala de grises para detección de rostros
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detectar rostros en el frame
        rostros = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

        for (x, y, w, h) in rostros:
            # Recortar el rostro detectado
            rostro = frame[y:y+h, x:x+w]
            rostro_rgb = cv2.cvtColor(rostro, cv2.COLOR_BGR2RGB)

            try:
                # Analizar emociones con DeepFace
                resultado = DeepFace.analyze(rostro_rgb, actions=["emotion"], detector_backend="opencv", enforce_detection=False)
                
                # Manejar listas en el resultado
                if isinstance(resultado, list):
                    resultado = resultado[0]
                
                # Extraer la emoción dominante
                emocion = resultado.get("dominant_emotion", "No detectada")
                print(f"Emoción detectada: {emocion}")  # Imprime la emoción en la consola

                # Opcional: Mostrar la emoción detectada en el video
                cv2.putText(frame, f"Emocion: {emocion}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

            except Exception as e:
                print(f"Error al analizar la emoción: {e}")

        # Mostrar el video en tiempo real (puedes comentar esta parte si no quieres verlo)
        cv2.imshow("Detección de emociones", frame)

        # Presiona 'q' para salir
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Liberar la cámara y cerrar las ventanas
    camera.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    analizar_emocion_con_camara()
