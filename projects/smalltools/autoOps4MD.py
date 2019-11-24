"""autoOps4MD
This program is a tool for automation operations of markdown file. 

The function "autoNumber" search and number the headings with "##" , "###", "####" mark labels in the specified
markdown files or directory which includes markdown files.

The function "modiImageImportFormat" assign the images width="480" and make it  more suitable for display in browser.
"""

import os
import sys
import re
import datetime

def autoNumber(srcFile,objFile):
    """autoNumber 
    Function:
        To create seiral number for the headings in the markdown file named srcFile
        and to write the newline into objFile.
        
    Arguments:
        - srcFile: some markdown file of which the headings need  create serial number.
        - objFile: the result file
    """
    level1 = 0
    level2 = 0
    level3 = 0
    excount = 0
    try:
        with open(srcFile,'r',encoding="utf-8") as rf:
            with open(objFile,"w+",encoding="utf-8") as wf:
                for line in rf: 
                    newline = line
                    if re.match('^[`"]{3}$',line):
                        excount += 1
                    if excount % 2 == 0:
                        # We don't auto number the headings in comments blocks 
                        # which is markuped by the pair of ``` or """,   
                        # so need to exclued comments markup: ``` and """ in md file.
                        h2re = r'(^#{2})\s+[\d\.]*\s*'
                        if re.match(h2re,line):  
                            level1 += 1
                            p = r'\1 ' + str(level1) +' '         
                            newline = re.sub(h2re,p,line)
                            level2 = 0
                            level3 = 0
                        h3re = r'(^#{3})\s+[\d\.]*\s*'
                        if re.match(h3re,line):
                            level2 += 1
                            p = r'\1 ' + str(level1) +'.'+str(level2) +' '
                            newline = re.sub(h3re,p,line)
                            level3 = 0
                        h4re = r'(^#{4})\s+[\d\.]*\s*'
                        if re.match(h4re,line):
                            level3 += 1
                            p = r'\1 ' + str(level1) +'.'+str(level2)+'.'+str(level3) +' '
                            newline = re.sub(h4re,p,line)
                    # Some batch operations regardless of context
                    #    To auto modify image import block
                    newline = modiImageImportFormat(newline) 

                    wf.write(newline)
    except Exception as e:
        print(e)
    print("{} created.".format(objFile))

def modiImageImportFormat(line):
    """
    modiImageImportFormat： 
    Function:
        To Modify the import format of image 
        from  r'^!\[(\S+)\]\((\S+)\)$' to r'<img src="\2" width="480" alt="\1" />'
    Arguments:
        - line：a line of markdown file.
    """
    newline = line
    imageRegexStr = r'^!\[([\-\*\+\?\w\s\u4e00-\u9fa5\.]+)\]\(([\w\s/\.\-]+)\)$'
    if re.match(imageRegexStr,line):  
        p = r'<img src="\2" width="480" alt="\1" />'
        newline = re.sub(imageRegexStr,p,line)

    return newline

def main():
    import sys
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("-d","--dir",type=str,
            help="some directory of markdown files")
    parser.add_argument("-f","--file",type=str,
            help="some markdown filename")
    args = parser.parse_args()
    datestr = str(datetime.date.today()).replace('-','')
    if args.dir:
        if os.path.isdir(args.dir):
            for root, dirs,files in os.walk(args.dir):
                curdir = root
                for filename in files:
                    if os.path.splitext(filename)[1]  == '.md':
                        srcFile = os.path.join(curdir,filename)
                        objFile =  os.path.join(curdir,os.path.splitext(filename)[0] + datestr + '.md')
                        # Some batch operations with context sensitively
                        autoNumber(srcFile,objFile)
        else:
            print("{} is not exist.".format(args.dir))
    elif args.file:
        
        if os.path.isfile(args.file):
            
            srcFile = args.file
            
            objFile =  os.path.join(os.path.dirname(srcFile),
                    os.path.basename(srcFile.split('.')[0] + datestr + '.md'))
            #objFile =  os.path.join(curdir,os.path.splitext(filename)[0] + datestr + '.md')
            # Some batch operations with context sensitively
            autoNumber(srcFile,objFile)
        else:
            print("{} is not exist.".format(args.file))

    """
    srcFile = sys.argv[1]
    datestr = str(datetime.date.today()).replace('-','')
    objFile =  os.path.join(os.path.dirname(srcFile),
                   os.path.basename(srcFile.split('.')[0] + datestr + '.md'))

    # Some batch operations with context sensitively
    autoNumber(srcFile,objFile)
    """
    

if __name__ == "__main__":
    main()
