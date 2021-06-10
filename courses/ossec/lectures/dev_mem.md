# /dev/mem

/dev/mem是物理内存的全映像，能够用来訪问物理内存，一般使用方法是 open("/dev/mem",O_RDWR|O_SYNC)，接着就能够用mmap来訪问物理内存以及外设的IO资源，这就是实现用户空间驱动的一种方法。