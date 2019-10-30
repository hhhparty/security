"""Headings Auto Number in  Markdown
"""

import os
import sys
import re

def addNumber(matched):
    print(matched.group())
    ret = matched.group()+ number +' '
    return ret

def autoNumber(objFile):
    level1 = 0
    level2 = 0
    level3 = 0
    with open(objFile,'r',encoding="utf-8") as rf:
        
        tmp =  os.path.join(os.path.dirname(objFile) ,
                os.path.basename(objFile).split('.')[0]+'-tmp'+'.md')
        with open(tmp,"w+",encoding="utf-8") as wf:
            for line in rf: 
                newline = line
                if re.match('^#{2}\s',line):  
                    level1 += 1
                    p = r'\1 ' + str(level1) +' '         
                    newline = re.sub('(^#{2}\s)',p,line)
              
                if re.match('^#{3}\s',line):
                    level2 += 1
                    p = r'\1 ' + str(level1) +'.'+str(level2) +' '
                    newline = re.sub('(^#{3}\s)',p,line)
                    
                if re.match(r'^#{4}\s',line):
                    level3 += 1
                    p = r'\1 ' + str(level1) +'.'+str(level2)+'.'+str(level3) +' '
                    newline = re.sub('(^#{4}\s)',p,line)
                    
                wf.write(newline)

if __name__ == "__main__":
    #print(os.getcwd())
    autoNumber(".\lectures\cyberhack\漏洞扫描.md")