# Nvidia driver install

## Ubuntu 22.04 下的安装

```shell
sudo apt update
sudo apt install -y gcc g++ make 

#查看gpu型号
lspci |grep -i nvidia

#下载对应驱动 https://www.nvidia.com/Download/index.aspx

#卸载 ubuntu 自带驱动
sudo apt remove --purge nvidia*
sudo apt remove --purge nvidia-*

#禁用nouveau
sudo vi /etc/modprobe.d/blacklist.conf
#进入文件后，再最后面一行加入：
blacklist nouveau
options nouveau modeset=0
#保存关闭
sudo update-initramfs -u
#重启电脑
#输入下列明令，如果没有任何输出则表示禁用成功
lsmod |grep nouveau
#可能需要安装lightdm
sudo apt install lightdm

#正式安装driver
sudo ./NVIDIA-Linux-x86_64-525.105.17.run  -no-x-check -no-nouveau-check -no-opengl-files
# 如果有错误可以参考https://zhuanlan.zhihu.com/p/115758882


#安装完成后，查看基本信息和cuda版本
nvidia-smi

#到https://developer.nvidia.com/cuda-toolkit-archive 查找相应的cuda，例如ubuntu2204x86 cuda 12.0 执行下列步骤安装

wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-ubuntu2204.pin

sudo mv cuda-ubuntu2204.pin /etc/apt/preferences.d/cuda-repository-pin-600wget https://developer.download.nvidia.com/compute/cuda/12.0.0/local_installers/cuda-repo-ubuntu2204-12-0-local_12.0.0-525.60.13-1_amd64.deb

sudo dpkg -i cuda-repo-ubuntu2204-12-0-local_12.0.0-525.60.13-1_amd64.deb

sudo cp /var/cuda-repo-ubuntu2204-12-0-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo apt-get updatesudo apt-get -y install cuda

```