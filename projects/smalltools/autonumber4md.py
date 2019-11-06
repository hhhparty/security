"""Headings Auto Number in  Markdown
"""

import os
import sys
import re
import datetime


def addNumber(matched):
    print(matched.group())
    ret = matched.group()+ number +' '
    return ret

def autoNumber(objFile):
    level1 = 0
    level2 = 0
    level3 = 0
    excount = 0
    
    with open(objFile,'r',encoding="utf-8") as rf:
        datestr = str(datetime.date.today()).replace('-','')
        tmp =  os.path.join(os.path.dirname(objFile) ,
                os.path.basename(objFile).split('.')[0] + datestr + '.md')
        with open(tmp,"w+",encoding="utf-8") as wf:
            for line in rf: 
                newline = line
                if re.match('^[`"]{3}$',line):
                    excount += 1
                if excount % 2 == 0:
                    # We don't auto number the headings in comments blocks 
                    # which is markuped by the pair of ``` or """,   
                    # so need to exclued comments markup: ``` and """ in md file.
                    if re.match(r'^#{2}\s',line):  
                        level1 += 1
                        p = r'\1' + str(level1) +' '         
                        newline = re.sub(r'(^#{2}\s)',p,line)
                        level2 = 0
                        level3 = 0
                    if re.match(r'^#{3}\s',line):
                        level2 += 1
                        p = r'\1' + str(level1) +'.'+str(level2) +' '
                        newline = re.sub(r'(^#{3}\s)',p,line)
                        level3 = 0
                    if re.match(r'^#{4}\s',line):
                        level3 += 1
                        p = r'\1' + str(level1) +'.'+str(level2)+'.'+str(level3) +' '
                        newline = re.sub(r'(^#{4}\s)',p,line)
                    
                wf.write(newline)


def main():
    import sys

    autoNumber(sys.argv[1])

if __name__ == "__main__":
    main()
