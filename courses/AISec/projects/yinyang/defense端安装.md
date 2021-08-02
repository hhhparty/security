# Defense 端安装

- 安装 ubuntu server 16.04 
- 修改 apt source为国内源， `sudo apt update`

## 安装Modsecurity WAF
- `apt install -y openssh-server vim git make libtool autoconf automake libffi-dev  g++ flex bison curl doxygen libyajl-dev libgeoip-dev dh-autoreconf libcurl4-gnutls-dev libxml2 libpcre++-dev libxml2-dev`
- `git clone git@github.com:SpiderLabs/ModSecurity.git`
- `git checkout -b v3/master origin/v3/master`
- `sudo build.sh`
- `sudo git submodule init`
- `sudo git submodule update` #[for bindings/python, others/libinjection, test/test-cases/secrules-language-tests]
- `sudo ./configure`
- `sudo make`
- `sudo make install`

## 安装ossec HIDS
- `git clone git@github.com:ossec/ossec-hids.git`