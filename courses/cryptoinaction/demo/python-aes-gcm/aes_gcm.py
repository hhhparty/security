#!/usr/bin/python3

import secrets
import base64
import os
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

def generateSecureRandom(bytenumber=256):
    """generating cryptographically strong random numbers """
    return secrets.token_hex(bytenumber)


def aes128_cbc(user_password=None):
    """example aes128-cbc encryption and decryption with Fernet."""
    # simple
    key = Fernet.generate_key()
    f = Fernet(key)
    token = f.encrypt(b"my deep dark secret.")
    print(f.decrypt(token))

    # with user password
    password = user_password
    salt = os.urandom(16)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password))
    f = Fernet(key)
    # Encryption
    token = f.encrypt(b"Secret message!")
    print("secret text: ",token)
    # Decrytption
    dtext = f.decrypt(token)
    print(dtext)


def main():
    user_password = b'secret_password'
    print("Fernet impl")
    aes128_cbc()
if __name__ == "__main__":
    main()