"""A DEMO OF AES

5 practice method: ECB, CBC, CTR, CFB, OFB
"""

from Crypto.Cipher import AES
from Crypto import Random
import base64
import sys
import click

class AESUtil:
    BLOCK_SIZE_16 = AES.block_size

    @staticmethod
    def encryptWithCBC(plaintext,key,iv):
        cipher = AES.new(key,AES.MODE_CBC,iv)
        x = AESUtil.BLOCK_SIZE_16 - (len(plaintext) % AESUtil.BLOCK_SIZE_16)
        if x!= 0:
            # 填充最后分组的不足位数
            plaintext = plaintext + chr(x) * x
        msg = base64.b64encode(cipher.encrypt(plaintext))
        return msg

    @staticmethod
    def decryptWithCBC(cryptedtext, key, iv):
        cipher = AES.new(key, AES.MODE_CBC, iv)
        # enStr += (len(enStr) % 4)*"="
        # decryptByts = base64.urlsafe_b64decode(enStr)
        msg = cipher.decrypt(base64.b64decode(cryptedtext))
        paddingLen = ord(msg[len(msg)-1])
        return msg[0:-paddingLen]
"""
@click
def aes_cbc()

    print("Usage:")
    print("encrypt：    python aes.py -e plaintext")
    print("decrypt：    python aes.py -d cryptedtext")

    if sys.argv[2] == "-e":
        print("使用AES-CBC加密：")
        AESUtil.encryptWithCBC(argv[3])
    if sys.argv[3] == "-d":
        print("使用AES-CBC解密：")
        AESUtil.decryptWithCBC(argv[3])  
"""
KEY = "aaaaaaaaaaaaaaaa"
IV = "HHHHHHHHHHHHHHHH"
if __name__ == "__main__":
    print("encryptWithCBC...")
    plaintext = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    for i in range(32):
        print("{:>32}: {}".format(plaintext[:i+1],AESUtil.encryptWithCBC(plaintext[:i+1],KEY,IV)))
    
"""
AAAAAAAAAAAAAAA:  b'xR2ATRcD65zssxMNMHJ+VA=='
AAAAAAAAAAAAAAAA: b'TRIL1Ki28JK1KzllR6vfavwygKgjPzIUyi2k/pzLtlk='
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:  b'TRIL1Ki28JK1KzllR6vfakhEdZJAdWBKjE4pYFfDg14='
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA: b'TRIL1Ki28JK1KzllR6vfapuzn4s5l3wAZuGkr1bo1h5Pde8xgxTKOOOC9DI42PjO'
"""