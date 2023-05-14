#!/usr/bin/env python3
# -*- coding:utf-8 -*-
"""

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


__author__ = "wujiu"
__email__ = "hhhparty@163.com"
__date__ = "2023-04-25"


This script can be used to crawl standard files from CCSA website:
https://ccsa.org.cn/publicityPublic/ .

"""

import os
import requests
import re
import threading
import time
import queue
from lxml import etree
import io
import urllib
from urllib.request import urlopen,Request
import ssl
import certifi
import wget


TOTAL_PAGE_NUM = 119
SAVE_PATH = "./output/"
TOKEN = "89775554dfbbf24f05ca4d608f0579b8"


class Standard():
    def __init__(self):
        self.page_queue = queue.Queue()
        self.id_queue = queue.Queue()
        self.detail_date = queue.Queue()
        self.savepath = SAVE_PATH
        self.downfileurls = set()
        self.headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en,zh-CN;q=0.9,zh;q=0.8",
            "Connection": "keep-alive",
            "Host": "www.ccsa.org.cn",
            "Origin": "https://ccsa.org.cn",
            "Referer": "https://ccsa.org.cn/",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
            "Cookie":"ccsa-token=89775554dfbbf24f05ca4d608f0579b8",
            "sec-ch-ua": '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
            "token": TOKEN,
        }

    def login_post_data(self,page_num,detailId):
        data = {
            "username": "chinaicv19",
            "password": "Q2ljdjIwMjA=", 
            "uuid": "375d82d4-5150-4af0-8bad-381bf0006fc0",
        }
    def save_file(self,fileurl,filename):
        
        filepath = os.path.join(self.savepath,filename+".pdf")
        print("正在保存文件{} 到 {}".format(filename,self.savepath))
        
        #r = requests.get(fileurl, headers=self.headers)
        #request = Request(url=fileurl,headers=self.headers)
        
        #context = ssl._create_unverified_context()
        #r = urlopen(request,context=context)
        #urllib.urlretrieve(fileurl,filepath)
        #r = requests.get("http://localhost:8000/2022%E5%B9%B4%E5%9B%BD%E6%B1%BD%E6%99%BA%E8%81%94%E5%81%A5%E5%BA%B7%E4%BD%93%E6%A3%80%E6%89%8B%E5%86%8C.pdf",headers=self.headers)
        #bytes_io = io.BytesIO(r.content)
        #self.downfileurls.add(fileurl)
        #os.system("wget -o " + filepath + "  "+ fileurl)

        r = requests.get(fileurl, stream=True, headers=self.headers)
        with open(filepath, "wb+") as f:
            for chunk in r.iter_content(chunk_size=4096):
                f.write(chunk)        
        """
        with open(os.path.join(self.savepath,"downfileurls.txt"),"a") as f:
            f.write(fileurl+'\n')
        # 方法一
        with open(filepath,"wb") as f:
            f.write(bytes_io.getvalue())
        
        # 方法二
        r = requests.get(fileurl, stream=True, headers=self.headers)
        with open(filepath, "wb") as f:
            for chunk in r.iter_content(chunk_size=1024):
                f.write(chunk)
        
        """
        print("保存完毕")
    def req_page_data(self):
        while True:
            print("尝试爬取标准。。。")
            page_num = self.page_queue.get()
            try:
                
                print("开始爬...")
                #per_page_data_req = requests.get("www.baidu.com")#https://ccsa.org.cn/publicityPublic")#, headers=self.headers)
                r = requests.get("https://www.ccsa.org.cn/api/td/approval/mhData?page=" 
                                    + str(page_num) + "&limit=20&projectName=&t="+str(int(time.time())) 
                                    , headers=self.headers)
                r.encoding = 'utf-8'
                d = r.json()
         
                urlformat = "https://ccsa.org.cn/newApproval/?tcwgName={}&id={}"
                
                for s in d["page"]["list"]:
                    
                    #surl = urlformat.format(s["projectName"], s["planCode"])
                    #print(s["id"],surl)

                    url2 = "https://www.ccsa.org.cn/api/td/approval/approvalFile/{}?t={}".format(s["id"],str(int(time.time())))
                 
                    r2 = requests.get(url2, headers=self.headers)
                    r2.encoding = 'utf-8'
                    d2 = r2.json()
                    filename = s["projectName"]
                    fileurl = d2["fileUrl"]
                    
                    self.save_file(fileurl,filename)
                    #break
                   
                
                """
                html = etree.HTML(r.text)
                al = html.xpath('//div[@class="el-card__body"]/ul/li/span[@class="title"]/a[@href]')
                for a in al:
                    print(a.attrib['href'])
                """
            except Exception as e:
                print(e)
                self.page_queue.put(page_num)
                print("Request error")
            self.page_queue.task_done()

            break
    def run(self):
        for page_num in range(1, TOTAL_PAGE_NUM):
            self.page_queue.put(page_num)

        thread_list = []
        for i in range(1):
            Treq_page = threading.Thread(target=self.req_page_data)
            thread_list.append(Treq_page)
        
        for t in thread_list:
            t.setDaemon(True)
            t.start()
        
        for q in [self.page_queue,self.id_queue]:
            q.join()
        print("完成")


if __name__ == "__main__":
   std = Standard()
   std.run()