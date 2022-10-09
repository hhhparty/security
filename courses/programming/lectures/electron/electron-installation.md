# Installation

1.[下载](https://nodejs.org/en/download/) Node.js,linux下是下载nodejs发布包，解压后可用。

2.使用`node -v` 和`npm -v` 验证安装是否成功，如果不行，可能是路径问题。假设安装到 /usr/share/nodejs/node16lts,那么在/usr/bin/下建立软连接

`sudo ln -s /usr/share/nodejs/node-v16.17.1-linux-x64/bin/node /usr/bin/node`
`sudo ln -s /usr/share/nodejs/node-v16.17.1-linux-x64/bin/npm /usr/bin/npm`

3.安装cnpm 

`npm install -g cnpm --registry=https://registry.npm.taobao.org`

`sudo ln -s /usr/share/nodejs/node-v16.17.1-linux-x64/bin/cnpm /usr/bin/cnpm`

4.建立一个存放electron 的目录

`mkdir electronws;cd ~/workspace/electronws  `  

5.安装elctron ，并建立软连接

`cnpm install electron --save-dev` 

或者全局安装 `cnpm install electron -g` 
`sudo ln -s /usr/share/nodejs/node-v16.17.1-linux-x64/bin/electron /usr/bin/electron`


6.安装 electron-packager

cnpm install -g electron-packager --save-dev

