root_path=$(echo $(pwd)/$(dirname $0)|sed -e 's!/./!/!g')
echo "================================================================"
echo "Start Install from essential"
echo "================================================================"
echo "start install "
sudo apt update&&
sudo apt upgrade -y&&
sudo apt install build-essential python3 cmake git zsh&&

for target_script in ${root_path}/target/*.sh
do
    source ${target_script}
done