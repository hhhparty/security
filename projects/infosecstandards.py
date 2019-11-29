import requests
from bs4 import BeautifulSoup



def fetchUrl(url):
    try:
        headers = {
            "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9",
            "Accept-Language":"zh-CN,zh;q=0.9",
            "Cookie":"UM_distinctid=16e87b4eb7d45-0b9f7c81cdf82b-7711a3e-1fa400-16e87b4eb7e50b; ",
            "Host":"lawv3.wkinfo.com.cn",
            "Proxy-Connection":"keep-alive",
            "Referer":"http://lawv3.wkinfo.com.cn/topic/61000000448/",
            "Upgrade-Insecure-Requests":"1",
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36",

        }
        r = requests.get(url,headers=headers)
        r.raise_for_status()
        r.encoding = r.apparent_encoding
        return r.text

    except:
        return "Some exceptions were raised."

url = "http://www.httpbin.org/user-agent"
fetchUrl(url)



if __name__ == "__main__":
    urls = [
        "http://lawv3.wkinfo.com.cn/topic/61000000448/1.HTML",
        "http://lawv3.wkinfo.com.cn/topic/61000000448/2.HTML",
        "http://lawv3.wkinfo.com.cn/topic/61000000448/3.HTML",
        "http://lawv3.wkinfo.com.cn/topic/61000000448/4.HTML",
        "http://lawv3.wkinfo.com.cn/topic/61000000448/5.HTML",
        "http://lawv3.wkinfo.com.cn/topic/61000000448/6.HTML",
        "http://lawv3.wkinfo.com.cn/topic/61000000448/7.HTML",
        "http://lawv3.wkinfo.com.cn/topic/61000000448/8.HTML",
        "http://lawv3.wkinfo.com.cn/topic/61000000448/9.HTML",
        "http://lawv3.wkinfo.com.cn/topic/61000000448/10.HTML",
        "http://lawv3.wkinfo.com.cn/topic/61000000448/11.HTML",
        "http://lawv3.wkinfo.com.cn/topic/61000000448/12.HTML",    
    ]
    for url in urls:
        print(fetchUrl(url))
        break