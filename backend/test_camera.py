import cv2

# Inicializar la cámara
camera = cv2.VideoCapture(0)

while True:
    ret, frame = camera.read()
    if not ret:
        print("No se pudo acceder a la cámara")
        break

    # Mostrar el frame capturado
    cv2.imshow("Frame", frame)

    # Presiona 'q' para salir
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Liberar la cámara y cerrar la ventana
camera.release()
cv2.destroyAllWindows()
