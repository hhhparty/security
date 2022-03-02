#!/usr/bin/bash


###
# 本文件用于自动化安装victim-server所需的各种软件和支持库。
# hhhparyt@163.com
# 2021-03-18
#
# 执行本脚本前，请在linux server ~/Downloads下构建install目录，并拷入下列文件
# 1. ubuntu2004cnsource.list
# 2. Anaconda3-5.3.1-Linux-x86_64.sh
# 3. node-v14.15.2-linux-x64.tar.xz
# 4. attack-navigator-master.tar.gz
# 5. openjdk-12.0.2_linux-x64_bin.tar.gz
# 6. rubygems-3.2.8.tgz
# 7. machine_learning_security.tar.gz  
# 8. metasploit-framework.tar.gz
#
###

IMAGES_BASE=/home/leo/Downloads/server_install/

print(){
	# for sh as soon as dash
	#echo "\033[36m $1 \033[0m" 
	# for bash
	echo -e "\e[92m $1 \e[0m"
}



apt_source_update(){
	print "1. config apt sources.list and update..."
    #配置Ubuntu apt 国内源并完成apt source 更新。
	INSTALL_BASE="./"
	APTSOURCE_SRC_FILE="ubuntu2004cn.list"
	APTSOURCE_DST_FILE="/etc/apt/sources.list"


	if test -e ${INSTALL_BASE}${APTSOURCE_SRC_FILE}
	then		
		sudo mv ${APTSOURCE_DST_FILE} ${APTSOURCE_DST_FILE}".bak" 
		sudo cp  ${INSTALL_BASE}"ubuntu2004cn.list"  ${APTSOURCE_DST_FILE}
	else
		echo "Ubuntu apt source file isn't exist."
	fi

	sudo apt update

}

support_lib_install(){
    print "2. install support library..."
    sudo apt install -y openssh-server vim git make libtool autoconf automake libffi-dev  g++ flex bison curl doxygen libyajl-dev libgeoip-dev dh-autoreconf libcurl4-gnutls-dev libxml2  libpcre++-dev libxml2-dev build-essential libpcap-dev libpq-dev zlib1g-dev libsqlite3-dev gcc libc6-dev  libgdbm-dev libncurses5-dev libyaml-dev  pkg-config sqlite3  libgmp-dev libreadline-dev libssl-dev
	
    print "   install support library...done"
}
docker_install(){
	cd ${IMAGES_BASE}
	print "3. install docker and compose..."
	sudo apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
	#国内源
	curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
	
	sudo add-apt-repository "deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
	sudo apt update
	# 国际源
	## curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
	## add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
	sudo apt install -y docker-ce docker-ce-cli containerd.io
	sudo systemctl start docker
	sudo docker version
	sudo docker container run hello-world
	
	sudo apt install -y python3-pip
	pip3 install --upgrade pip
	pip3 install six --user -U
	pip3 install docker-compose
	sudo docker-compose --version
	print "   install docker and compose...done."
}
anaconda3_install(){
	print "4. install anaconda3 and build attack env..."
	cd ${IMAGES_BASE}
	if test -e "/opt/anaconda3"
	then
		:
	else
		if test -e "Anaconda3-5.3.1-Linux-x86_64.sh"
		then
			sudo chmod 755 ./Anaconda3-5.3.1-Linux-x86_64.sh
			./Anaconda3-5.3.1-Linux-x86_64.sh -b -p /opt/anaconda3 
			sudo chown -R leo:leo /opt/anaconda3
			sudo chmod 755 /opt/anaconda3/etc/profile.d/conda.sh
		else
			:
		fi
	fi
	
	cd /opt/anaconda3
	
	#echo ". /opt/anaconda3/etc/profile.d/conda.sh" >> ~/.bashrc
	
	source /opt/anaconda3/etc/profile.d/conda.sh
	export PATH="/opt/anaconda3/bin:$PATH"
	if test -e "/opt/anaconda3/envs/attack"
	then
		:
	else
		conda create  -p /opt/anaconda3/envs/attack python=3.8
	fi
	
	
	cd /opt/anaconda3/envs/attack
	if test -e "/opt/anaconda3/envs/attack/DeepExploit"
	then
		:
	else
		tar xzf ${IMAGES_BASE}DeepExploit.tar.gz -C /opt/anaconda3/envs/attack/ 
	fi
	
	###
	#TODO:
	#这里仍然无法利用shell激活虚拟环境，需要手动安装attack中的内容
	#source conda activate attack
	print "Cannot active attack virtul environment and complete pip installation process in bash shell, pleas do it manually as following command list: "
	print "  (1) conda activate attack"
	print "  (2) cd /opt/anaconda3/envs/attack/DeepExploit"
	print "  (3) conda install pip"
	print "  (4) pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt"
	
	
}
ruby_install(){
	cd ${IMAGES_BASE}
	print "5. install rvm , ruby and gem..."
	#参考https://github.com/rvm/ubuntu_rvm
	#apt install -y software-properties-common
	#apt-add-repository -y ppa:rael-gc/rvm
	#apt update
	#apt install -y rvm
	#usermod -a -G rvm leo #Add your user to rvm group
	
	#apt install ruby 有问题，采用下面的方法安装。
	apt install -y gnupg2 
	gpg --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
	#为了解决github无法访问的问题加入一个可用ip
	#echo 199.232.28.133  raw.githubusercontent.com | tee -a //etc/hosts
	#echo PATH="/usr/local/rvm/scripts:/usr/local/rvm/bin:$PATH" |tee -a /home/leo/.profile
	
	cd /usr/local
	if test -e /usr/local/rvm
	then
		:
	else
		\curl -sSL https://get.rvm.io | bash -s stable
	fi
	source ~/.profile
	rvm -v
	
	rvm install ruby2.7
	ruby -v
	
	cd ${IMAGES_BASE}
	if test -e "rubygems-3.2.8.tgz"
	then
		tar xfk rubygems-3.2.8.tgz -C /opt/
		cd /opt/rubygems-3.2.8/
		ruby setup.rb
	else 
		print "Error, rubygems-3.2.8.tgz dosen't exist."
	fi
	
}
postgresql_install(){
	cd ${IMAGES_BASE}
	print "6. install postgresql for msf and start it..."
	apt install -y postgresql postgresql-contrib postgresql-client
	systemctl start postgresql 
	update-rc.d postgresql enable
	systemctl restart postgresql
	###
	# 下列交互命令请手工完成
	#su postgres
	#建议修改postgres用户密码
	# ALTER USER postgres WITH PASSWORD 'my_password';
	# 或者使用\password postgres 
	# 可先用弱口令123456作为测试例
}
msf_install(){
	cd ${IMAGES_BASE}
	print "7. install metasploit-framework ..."
	if test -e "metasploit-framework.tar.gz"
	then
		#解压到/opt/metasploit-framework,但不覆盖已有文件
		tar zvxfk metasploit-framework.tar.gz -C /opt/
		cd /opt/matesploit-framework/
		if test -e "bundle"
		then
			gem install bundle#安装依赖
			
			#bundle install
		else
			:
		fi
	else
		echo "Please copy metasploit-framework.tar.gz in Downloads/server_install/"
	fi
}

main(){
    print "Start to install and config victim-server..."
	cd ${IMAGES_BASE}
    #apt_source_update
    #support_lib_install
	#docker_install
	#anaconda3_install
	#ruby_install
	#postgresql_install  
	#print "需要手工执行部分在本脚本postgresql_install函数的注释中。"
	#msf_install
}

main