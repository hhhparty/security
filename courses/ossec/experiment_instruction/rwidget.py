import os
import re

#pattern = re.compile('^- [\u4e00-\u9fa5]+')
#或用pattern = re.compile([^\x00-xff]）匹配双字节字符
pattern = re.compile('^- [^\x00-\xff]+')
def findAll(pattern,targetfile):
    """find all strings which match the pattern in the targetfile. """
    with open(targetfile,'r',encoding='utf-8') as f:
        for l in f.readlines():
            m = pattern.search(l)
            if m:
                print(m.group())

def findSomePoundKey(aLineText):
    """Find a # which shows a chapter will begin in targetMDfile"""
    p = re.compile('#+')
    if p.match(aLineText):
        return True
    else:
        return False
    
def replaceMinusWithMNum(targetfile):
    """To replace the minus sign which shows some list items with 
       the style consist of the minus sign and incremental integer.
    """
    initnum = 1
    p1 = re.compile('^\s*-\s')
    with open(targetfile,'w',encoding='utf-8') as f:
        for l in f:
            if findSomePoundKey(l):
                initnum = 1
            m = p1.match(l)
            if m:
                begin,end = m.span()
            #To-Do 
            # 文件内容替换操作
            



if __name__ == "__main__":
    import os
    #print(os.getcwd())
    findAll(pattern,"lectures\ossec\实验手册\实验9Linux账户和登录安全运维实验.md")


