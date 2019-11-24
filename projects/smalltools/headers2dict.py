text=r"""
thw=cn; 
cna=vci1Ff9tXTcCAWdavQq45RyK; 
t=5922c3d73a9a97219e796951f673161d; 
lgc=nchycom; 
tracknick=nchycom; tg=0; enc=NRzcjpZZU2DsXuSVQWjOD%2FdgoJs091d1tIr1OwkBKMCr1ur7i4mfI8DJrwGIha7RZY7ag0yPV5xXuOfkpPFdYw%3D%3D; hng=CN%7Czh-CN%7CCNY%7C156; v=0; cookie2=14cef6d3a92d856e6f412cca3d540a38; _tb_token_=e1787e17133e6; unb=75965512; uc3=id2=VASjULlFuZE%3D&vt3=F8dByuQDYTLj2te6%2Fm4%3D&lg2=VT5L2FSpMGV7TQ%3D%3D&nk2=DeSe0Q8ONA%3D%3D; csg=0f6fc257; cookie17=VASjULlFuZE%3D; dnk=nchycom; skt=f7f18af33f92b7a9; existShop=MTU3NDUwMjA0MA%3D%3D; uc4=id4=0%40Vh3Dtwy4orMbQ7cG8JgNj%2BqJLg%3D%3D&nk4=0%40DzERyuLSckbO7cdHC4sb2PB9; _cc_=W5iHLLyFfA%3D%3D; _l_g_=Ug%3D%3D; sg=m23; _nk_=nchycom; cookie1=BqJk9D7342ZkMXFfMykDvEYqmkiwE8r43rljzNeky5E%3D; mt=ci=57_1; alitrackid=i.taobao.com; lastalitrackid=i.taobao.com; uc1=cookie16=UIHiLt3xCS3yM2h4eKHS9lpEOw%3D%3D&cookie21=VFC%2FuZ9aiKCaj7AzMHh1&cookie15=UtASsssmOIJ0bQ%3D%3D&existShop=false&pas=0&cookie14=UoTbmVU5Yv1UfQ%3D%3D&tag=8&lng=zh_CN; JSESSIONID=A372A25931AF9C9CE8E6E12BD20FF4BB; l=dB_Ox0mVqylJ4GUABOfBnurza77TqQAbzrVzaNbMiICPOUf1iTNAWZpt4yTBCnGV3sN6R3Jt3efYBXYLwyUIh2nk8b8CgsDpKdTeR; isg=BBISzf5Wm3WGZ-e_cBrkhqBYY9g0ixfV7e3WjtxpdUSm77DpxLOWzbpJXwv2mY5V
"""

import re

p = re.compile(r"([:\w-]+):\s*([\w\.\-/\(\t;\) ,? \+=\*:%]+)")

r = "\"" + r"\1"  + "\":\"" + r"\2" +"\","

newline = "{"+ re.sub(p,r,text) +"}"

print(newline)