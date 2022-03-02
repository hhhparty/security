# Linux Shell 变量处理

## 变量截取

Shell中的${}、##和%%
假设定义了一个变量为：
代码如下:
`export file=/dir1/dir2/dir3/my.file.txt`

### 变量的删除
可以用`${ }`分别替换得到不同的值：
`${file#*/}`：删掉第一个 / 及其左边的字符串：dir1/dir2/dir3/my.file.txt
`${file##*/}`：删掉最后一个 / 及其左边的字符串：my.file.txt
`${file#*.}`：删掉第一个 . 及其左边的字符串：file.txt
`${file##*.}`：删掉最后一个 . 及其左边的字符串：txt
`${file%/*}`：删掉最后一个 / 及其右边的字符串：/dir1/dir2/dir3
${file%%/*}：删掉第一个 / 及其右边的字符串：(空值)
${file%.*}：删掉最后一个 . 及其右边的字符串：/dir1/dir2/dir3/my.file
${file%%.*}：删掉第一个 . 及其右边的字符串：/dir1/dir2/dir3/my

记忆的方法为：
- `#` 是 去掉左边（键盘上`#`在 `$` 的左边）
- `%`是去掉右边（键盘上% 在$ 的右边）
- 单一符号是最小匹配；两个符号是最大匹配
`${file:0:5}`：提取最左边的 5 个字节：/dir1
`${file:5:5}`：提取第 5 个字节右边的连续5个字节：/dir2

### 变量的替换
`${file/dir/path}`：将第一个dir 替换为path：/path1/dir2/dir3/my.file.txt
`${file//dir/path}`：将全部dir 替换为 path：/path1/path2/path3/my.file.txt

`${LINE%%*}`的意思就是从LINE这个变量的值中，从后面开始以最长匹配删去%%后面的表达式内容。
看一下man bash可以找到详细说明，查找Parameter Expansion这段会看到：
`${parameter%word}`
`${parameter%%word}`
都是从parameter的最后开始删除word所匹配的内容，%是最短匹配，%%是最长匹配。

例子：批量改名

```
for name in `ls kali-*.svg`;do `sudo mv $name cicv-${name#*-}` ;done
```