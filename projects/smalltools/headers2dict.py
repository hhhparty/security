text=r"""
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Cache-Control: max-age=0
Cookie: UM_distinctid=16e87b4eb7d45-0b9f7c81cdf82b-7711a3e-1fa400-16e87b4eb7e50b; CNZZDATA3146741=cnzz_eid%3D1244056825-1574232859-http%253A%252F%252Flawv3.wkinfo.com.cn%252F%26ntime%3D1574232859
Host: lawv3.wkinfo.com.cn
If-Modified-Since: Fri, 16 Aug 2019 13:18:52 GMT
If-None-Match: W/"11904-1565961532000"
Proxy-Connection: keep-alive
Referer: http://lawv3.wkinfo.com.cn/topic/61000000448/4.HTML
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36
"""

import re

p = re.compile(r"([\w-]+):\s*([\w\.\-/\(\t;\) ,? \+=\*:%]+)")

r = "\"" + r"\1"  + "\":\"" + r"\2" +"\","

newline = "{"+ re.sub(p,r,text) +"}"

print(newline)