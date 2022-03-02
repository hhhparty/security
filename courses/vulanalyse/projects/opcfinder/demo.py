from ctypes import *

dll = CDLL("shell32.dll")
print(dll.Add)