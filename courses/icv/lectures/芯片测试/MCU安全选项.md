# MCU 安全选项

多数MCU都带有多种可配置的安全功能，例如：
- Read Out Protection
- Code Security
- Lock Bits
- Debug Disable
- Memeory Protection


这些安全功能限制了外部调试器对MCU的访问。例如最常用的安全功能事禁止一些flash控制器的功能，以至于内部flash memory 不能再被外部调试器所访问，可以用于保护知识产权、私钥货别的存放在固件中的内容。其他安全特性，也是通过各种方式限制对内存、cpu、特定功能寄存器的访问，通常是AHB-AP，完全禁用调试单元，或者合并了多个先前提到的安全选项。

每个MCU的安全机制是不一样的。往往需要不同的设备和方法进行测试。

使用Segger J-Link 可以实现安全特性的检查，它支持近8000种mcu的检查。