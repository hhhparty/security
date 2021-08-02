#!/usr/bin/sh
###
# 本文件用于自动化安装victim-server所需的各种软件和支持库。
# hhhparyt@163.com
# 2021-03-18
###
print(){
	echo "\033[36m $1 \033[0m" 
}

apt_source_update(){
    #配置Ubuntu apt 国内源并完成apt source 更新。
	INSTALL_BASE="./"
	APTSOURCE_SRC_FILE="ubuntu2004cn.list"
	APTSOURCE_DST_FILE="/etc/apt/sources.list"


	if test -e ${INSTALL_BASE}${APTSOURCE_SRC_FILE}
	then
		print "1. copy "${INSTALL_BASE}${APTSOURCE_SRC_FILE}" to "${APTSOURCE_DST_FILE}
		mv ${APTSOURCE_DST_FILE} ${APTSOURCE_DST_FILE}".bak" 
		cp  ${INSTALL_BASE}"ubuntu2004cn.list"  ${APTSOURCE_DST_FILE}
	else
		echo "Ubuntu apt source file isn't exist."
	fi

	apt update

}

support_lib_install(){
    print "2. install support library..."
    apt install -y openssh-server vim git make libtool autoconf automake libffi-dev  g++ flex bison curl doxygen libyajl-dev libgeoip-dev dh-autoreconf libcurl4-gnutls-dev libxml2  libpcre++-dev libxml2-dev
    print "   install support library...done"
}
docker_install(){
	print "3. install docker and compose..."
	apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
	#国内源
	curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
	add-apt-repository "deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
	apt update
	# 国际源
	## curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
	## add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
	apt install -y docker-ce docker-ce-cli containerd.io
	systemctl start docker
	docker version
	docker container run hello-world
	
	apt install -y python3-pip
	pip3 install --upgrade pip
	pip3 install six --user -U
	pip3 install docker-compose
	docker-compose --version
	print "   install docker and compose...done."
}
webgoat_install(){
	print "4. pull webgoat8.0 docker image..."
	docker pull webgoat/webgoat-8.0

}
juiceshop_install(){
	print "5. pull bkimminich/juice-shop docker image..."
	docker pull bkimminich/juice-shop
}
dvwa_install(){
	print "6. pull citizenstig/dvwa docker image..."
	docker pull citizenstig/dvwa
}
vulhub_install(){
	print "7. install vulhub..."
	# Download project
	cd /home/leo/Downloads
	if test -e vulhub-master.zip 
	then
		:
	else
		wget https://github.com/vulhub/vulhub/archive/master.zip -O vulhub-master.zip
	fi
	
	apt install -y unzip
	unzip -n vulhub-master.zip -d /opt/
	sleep 3
	cd /opt/vulhub-master

	# Enter the directory of vulnerability/environment
	cd flask/ssti

	# Compile environment and run...
	docker-compose build && docker-compose up -d
	sleep 10
	print "  install vulhub...done"

	# Close 
	# docker-compose down
}	
main(){
    print "Start to install and config victim-server..."

    apt_source_update
    support_lib_install
	docker_install
	webgoat_install
	juiceshop_install
	dvwa_install
	vulhub_install
}

main