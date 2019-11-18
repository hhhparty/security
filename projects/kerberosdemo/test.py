import yaml
import hashlib

def checkUser(userid):
    with open('users.yaml','r') as f:
        userfile = f.read()
    
    users = yaml.load(userfile, Loader=yaml.FullLoader)
    

    for i in users['users']:
        print(i)
        
def checkUser1(userid):
        users = [{"uid":"leo","pwd":"123"},{"uid":"neo","pwd":"456"}]
        
        for u in users:
            if u['uid'] == userid:
                pwdhc = hashlib.sha256(u['pwd'].encode('utf-8'))
                print("The pwd sha256 hashcode is ",pwdhc.hexdigest())
                return pwdhc.hexdigest()

        return ""


if __name__ == "__main__":
    #import os
    #os.getcwd()
    a = checkUser1('leo')
    print(a)