from flask import Blueprint, request, jsonify
import time
from cryptography.hazmat.primitives.asymmetric import rsa, ec
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.exceptions import InvalidSignature

validate_signature = Blueprint('validate_signature', __name__)

@validate_signature.route('/validate-signature', methods=['POST'])
def validate_dnssec_signature():
    try:
        data = request.get_json()
        dnskey = data.get("dnskey")
        rrsig = data.get("rrsig")
        rrdata = data.get("rrdata")
        algorithm = data.get("algorithm")
        
        if not all([dnskey, rrsig, rrdata, algorithm]):
            return jsonify({"error": "DNSKEY, RRSIG, RRdata, and Algorithm are required"}), 400
        
        start_time = time.time()
        is_valid = verify_signature(dnskey, rrsig, rrdata, algorithm)
        time_taken = (time.time() - start_time) * 1000  # Convert to milliseconds
        
        return jsonify({
            "valid": is_valid,
            "message": "The DNSSEC signature is valid." if is_valid else "The DNSSEC signature is invalid.",
            "timeTaken": time_taken
        })
    except Exception as e:
        return jsonify({"error": f"Failed to validate signature: {str(e)}"}), 500

def verify_signature(dnskey: str, rrsig: str, rrdata: str, algorithm: str) -> bool:
    try:
        # Load the public key (convert PEM format)
        public_key = serialization.load_pem_public_key(dnskey.encode())
        
        # Choose the correct hashing algorithm
        hash_algorithm = hashes.SHA256() if algorithm.lower() == "ecc" else hashes.SHA1()
        
        # Verify the signature
        public_key.verify(
            rrsig.encode(),  # Signature data
            rrdata.encode(),  # Original DNS data
            ec.ECDSA(hash_algorithm) if isinstance(public_key, ec.EllipticCurvePublicKey) else rsa.PKCS1v15()
        )
        return True
    except InvalidSignature:
        return False
    except Exception as e:
        print(f"Signature verification error: {e}")
        return False
