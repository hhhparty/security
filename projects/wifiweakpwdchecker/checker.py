import os,sys,csv
from subprocess import call, check_output,CalledProcessError,Popen


PASSWORD = os.path.join(os.path.abspath(os.path.dirname(__file__)),'password.csv')

def get_network_list():
    cmd = getOSCmd()
    r = call(cmd,shell=True)
    print(r)

def check(num,arg1):
    print("Try {}, name {}".format(num,arg1))


def getOSCmd():
    import platform as pt
    if pt.system() == "Windows" :
        cmd = " netsh wlan show networks mode=bssid > 123.txt"
    elif pt.system() == "Linux":
        print("Linux")
    elif pt.system() == "Darwin":
        print("MacOS")
    else:
        print("Other")

with open(PASSWORD,'rU') as f:
    reader = csv.reader(f)
    for i,line in enumerate(reader):
        check(i,line[0])

get_network_list()