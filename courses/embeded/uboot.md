# U-Boot

## 下载和编译

### 下载：
git clone https://source.denx.de/u-boot/u-boot.git
或者
git clone https://github.com/u-boot/u-boot

git checkout v2020.10

### 编译：
- 依赖安装
sudo apt-get install gcc gcc-aarch64-linux-gnu

如果是给arm架构的处理器使用，那需要下载交叉编译的gcc

`sudo apt install gcc-arm-linux-gnueabi`

编译uboot依赖的库：

sudo apt-get install bc bison build-essential coccinelle \
  device-tree-compiler dfu-util efitools flex gdisk graphviz imagemagick \
  liblz4-tool libgnutls28-dev libguestfs-tools libncurses-dev \
  libpython3-dev libsdl2-dev libssl-dev lz4 lzma lzma-alone openssl \
  pkg-config python3 python3-asteval python3-coverage python3-filelock \
  python3-pkg-resources python3-pycryptodome python3-pyelftools \
  python3-pytest python3-pytest-xdist python3-sphinxcontrib.apidoc \
  python3-sphinx-rtd-theme python3-subunit python3-testtools \
  python3-virtualenv swig uuid-dev


如果有些板子要求先构建 arm trusted firmware，那么参考相应的 [board-specific doc](https://u-boot.readthedocs.io/en/latest/board/index.html)

- 配置

configs/目录下包含了配置模版文件，命名规则：已维护的板子名称_deconfig。这些文件已经删掉了默认配置，所以你不能直接使用。生成对应的配置文件的方法是： make 板子名_defconfig

调整配置的方法是 make menuconfig

- 构建

交叉编译前，要制定交叉编译器的前缀。

export CROSS_COMPILE=<compiler-prefix> make

编译参数可选：
- -j , 使用并行方式加速编译过程。 例如 -j$(nproc)
- O=dir ,生成所有的输出文件到某个目录下，包括 .config
- V=1,  详细模式

### 设备树编译
使用 CONFIG_OF_CONTROL 的板子，需要设备树编译器（dtc）。那些带有 CONFIG_PYLIBFDT 的需要 pylibfdt，一种python库，用于访问设备树数据。相应的版本被包含在 U-Boot 树中，在scripts/dtc 中。

为了使用这些系统版本，使用DTC参数，例如：DTC=/usr/bin/dtc make

In this case, dtc and pylibfdt are not built. The build checks that the version of dtc is new enough. It also makes sure that pylibfdt is present, if needed (see scripts_dtc in the Makefile).

Note that the Host tools are always built with the included version of libfdt so it is not possible to build U-Boot tools with a system libfdt, at present.


### link-time optimisation(LTO)

uboot 支持链接时优化
NO_LTO=1 make
### 安装
The process for installing U-Boot on the target device is device specific. Please, refer to the board specific documentation [Board-specific doc](https://u-boot.readthedocs.io/en/latest/board/index.html).


## References

- https://u-boot.readthedocs.io/en/latest/build/gcc.html