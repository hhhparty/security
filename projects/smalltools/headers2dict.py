text=r"""
Host: baike.baidu.com
Connection: keep-alive
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36
Sec-Fetch-User: ?1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Referer: https://baike.baidu.com/item/%E9%82%AE%E4%BB%B6%E5%88%97%E8%A1%A8/3242524?fr=aladdin
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cookie: BAIDUID=427D8AC45B87E59C7DFFB9D4FC86A80A:FG=1; BIDUPSID=427D8AC45B87E59C7DFFB9D4FC86A80A; PSTM=1562547125; BK_SEARCHLOG=%7B%22key%22%3A%5B%22ID%22%5D%7D; BDUSS=1xVWdObmEzTThqcnFnTmlzbE5KaGlvOXo0dUI5V2hUNG1nWlo0akp2VXc4cGxkRVFBQUFBJCQAAAAAAAAAAAEAAABz6UcBZmx5YXRvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADBlcl0wZXJdVm; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; yjs_js_security_passport=803e0f0e692af01f00d4b68206081a8691e7d675_1573729072_js; H_PS_PSSID=1435_21091_29568_29220_22160; Hm_lvt_55b574651fcae74b0a9f1cf9c8d7c93a=1573018919,1573483554,1573782269,1573782347; Hm_lpvt_55b574651fcae74b0a9f1cf9c8d7c93a=1573782347; delPer=0; PSINO=1; PMS_JT=%28%7B%22s%22%3A1573785239469%2C%22r%22%3A%22https%3A//baike.baidu.com/item/%25E9%2582%25AE%25E4%25BB%25B6%25E5%2588%2597%25E8%25A1%25A8/3242524%3Ffr%3Daladdin%22%7D%29
"""

import re

p = re.compile(r"([\w-]+):\s*([\w\.\-/\(\t;\) ,? \+=\*:%]+)")

r = "\"" + r"\1"  + "\":\"" + r"\2" +"\","

newline = "{"+ re.sub(p,r,text) +"}"

print(newline)