from flask import Flask
from validate_signature.route import validate_signature
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Register the blueprint with correct URL prefix
app.register_blueprint(validate_signature, url_prefix="/validate-signature")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)

