"""
This program is a tool for removing duplicated files in disk.
"""

import os
import hashlib
import logging
import time

#logging.basicConfig(level=logging.NOTSET)
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# create a file handler
handler = logging.FileHandler('%s.log' % __file__)
handler.setLevel(logging.INFO) 
# create a logging format
 
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
 
# add the handlers to the logger
 
logger.addHandler(handler)
 
logger.info('%s begin to running...' % __file__)



def getFileHashCode(filepath,hashfunc = 'md5'):
    #retSeries = pd.Series()
    hash_funcs = ['md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512']
    if hashfunc not in hash_funcs:
        raise("Hash function: %s is invalid!" % hashfunc)
    if hashfunc == 'md5':
        holder = hashlib.md5()
    if hashfunc == 'sha1':
        holder = hashlib.sha1()
    with open(filepath,'rb') as f:
        while True:
            c = f.read(4096*8)
            if not c:
                break
            holder.update(c)
        #将生成的文件哈希码填入pandas series结构   
        #retSeries.append(holder.hexdigest())
    return holder.hexdigest()

def allfilespathGen(rootDir):
    
    if not os.path.isdir(rootDir):
        raise("Pls use a valid directory name.")
    for (root,dirs,files) in os.walk(rootDir):
        for f in files:
            filepath = os.path.join(root,f)
            yield filepath

if __name__ == "__main__":
    import sys
    if  len(sys.argv) < 2:
        print("Usage: python duplicatedfileremover.py  some_need_check_directory")
        print("Example: python duplicatedfileremover.py e:/documents/")
        exit()
    if not os.path.isdir(sys.argv[1]):
        print("  %s is not a valid directory." % sys.argv[1])
        print("  Usage: python duplicatedfileremover.py  some_need_check_directory")
        print("  Example: python duplicatedfileremover.py e:/documents/")
        exit()
    adict = {}
    msg = "Begin to calculate file hash code..."
    logger.info(msg)
    print(msg)
    counter = 0
    sum = 0
    for fp in allfilespathGen(r'E:\photoArchiev'):
        fhashcode = getFileHashCode(fp)
        if fhashcode not in adict:
            adict[fhashcode] = fp
            print(".",end="")
            sum += 1
        else:       
            msg = "%s has same hash code with %s." % (fp,adict[fhashcode])
            logger.info(msg)
            print(msg)
            
            msg = " %s is duplicated and will be removede." % fp
            logger.info(msg)
            print(msg)
            
            os.remove(fp)
            counter += 1
    
    msg = "There are %d files and %d duplicated files has been removed." % (sum,counter)
    logger.info(msg)
    print(msg)