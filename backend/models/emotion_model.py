from deepface import DeepFace
import cv2

def detectar_emocion_imagen_fija():
    """
    Detecta emociones en una imagen fija utilizando DeepFace.
    """
    try:
        # Cargar la imagen desde el archivo
        frame = cv2.imread("persona_imagen.jpg")

        # Convertir a RGB (DeepFace requiere este formato)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Analizar emociones con DeepFace
        resultado = DeepFace.analyze(frame_rgb, actions=["emotion"], detector_backend="opencv", enforce_detection=False)

        # Imprimir el resultado completo para depuración
        print(f"Resultado completo de DeepFace: {resultado}")

        # Manejar casos donde no exista "dominant_emotion"
        if "dominant_emotion" in resultado:
            return resultado["dominant_emotion"]

        # Calcular la emoción dominante manualmente
        emociones = resultado["emotion"]
        emocion_detectada = max(emociones, key=emociones.get)
        print(f"Emoción dominante calculada: {emocion_detectada}")
        return emocion_detectada

    except KeyError as e:
        print(f"Error al buscar la clave en el resultado: {e}")
        return "Error al buscar la clave 'dominant_emotion'"
    except Exception as e:
        print(f"Error al analizar la imagen fija: {e}")
        return f"Error: {str(e)}"
