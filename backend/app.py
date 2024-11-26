from flask import Flask, jsonify
from flask_cors import CORS
from models.emotion_model import detectar_emocion_imagen_fija

app = Flask(__name__)
CORS(app)

@app.route('/detect-emotion', methods=['GET'])
def detect_emotion():
    """
    Analiza una imagen fija para detectar emociones.
    """
    emocion = detectar_emocion_imagen_fija()
    return jsonify({"emocion": emocion})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
