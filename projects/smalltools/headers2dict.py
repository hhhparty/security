text=r"""
POST /translate_o?smartresult=dict&smartresult=rule HTTP/1.1
Host: fanyi.youdao.com
Proxy-Connection: keep-alive
Content-Length: 251
Accept: application/json, text/javascript, */*; q=0.01
Origin: http://fanyi.youdao.com
X-Requested-With: XMLHttpRequest
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Referer: http://fanyi.youdao.com/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Cookie: _ntes_nnid=538c8391b2cab8b6b51282c4448c194d,1567737512037; OUTFOX_SEARCH_USER_ID_NCOO=895304360.5780765; OUTFOX_SEARCH_USER_ID="721560860@10.168.11.69"; JSESSIONID=aaaKlEXpYuOVh80-h2i6w; ___rl__test__cookies=1574253932108
"""

import re

p = re.compile(r"([\w-]+):\s*([\w\.\-/\(\t;\) ,? \+=\*:%]+)")

r = "\"" + r"\1"  + "\":\"" + r"\2" +"\","

newline = "{"+ re.sub(p,r,text) +"}"

print(newline)