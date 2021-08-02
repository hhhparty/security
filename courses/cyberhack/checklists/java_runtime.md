# java 调用服务器命令脚本来执行功能

利用Runtime和ProcessBuilder类来使用Java执行Shell命令和脚本。
## Runtime 类执行脚本 

Runtime是Java一个高级类，它存在于每个Java应用程序中。通过它，应用程序本身可以与其所在的环境进行通信。

通过Runtime.getRuntime().exec()方法直接执行命令或运行.bat/.sh文件。

用法：         
```
public Process exec(String command)-----在单独的进程中执行指定的字符串命令。

public Process exec(String [] cmdArray)---在单独的进程中执行指定命令和变量

public Process exec(String command, String [] envp)----在指定环境的独立进程中执行指定命令和变量

public Process exec(String [] cmdArray, String [] envp)----在指定环境的独立进程中执行指定的命令和变量

public Process exec(String command,String[] envp,File dir)----在有指定环境和工作目录的独立进程中执行指定的字符串命令

public Process exec(String[] cmdarray,String[] envp,File dir)----在指定环境和工作目录的独立进程中执行指定的命令和变量
```
 

举例：

在windows下相当于直接调用   /开始/搜索程序和文件  的指令，比如`Runtime.getRuntime().exec("notepad.exe");`  可打开windows下记事本。

Linux下：

`Runtime.getRuntime().exec(new String[]{"/bin/sh","-c", ";`

Windows下：

`Runtime.getRuntime().exec(new String[]{ "cmd", "/c", cmds});`

 

实例：

`String command = "find " + source.getRoute() + " -name '" +source.getName();  ` 

`Process process = Runtime.getRuntime().exec(new String[] {"/bin/sh","-c",command});`

 

说明：
- bash是sh的完整版，bash完全兼容sh命令，反之不行
- -c string　　　   该选项表明string中包含了一条命令.如 bash -c ls ~


```
Process process = Runtime.getRuntime().exec("ping www.stackabuse.com");

public static void printResults(Process process) throws IOException {
    BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
    String line = "";
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

如果您想从某个文件夹中运行命令，则可以执行以下操作：

Process process = Runtime.getRuntime()
        .exec("cmd /c dir", null, new File("C:\\Users\\"));
      //.exec("sh -c ls", null, new File("Pathname")); for non-Windows users
printResults(process);


在此，我们为该exec()方法提供了command，，null用于表示新的环境变量，将new File()设置为工作目录。

cmd /c诸如此类的命令前的添加dir是值得注意的。

由于我在Windows上工作，因此这将打开cmd并/c执行后续命令。在这种情况下为dir。

让我们看一下如何使用环境变量：

Process process = Runtime.getRuntime().exec(
        "cmd /c echo %var1%",
        new String[]{"var1=value1"});
        
printResults(process);

我们可以在String数组中提供任意数量的环境变量。在这里，我们刚刚打印了var1using的值echo。

有时，将所有内容卸载到文件中并运行该文件要比以编程方式添加所有内容容易得多。

根据您的操作系统，您可以使用.bat或.sh文件。让我们用内容创建一个：

echo Hello World

然后，让我们使用与以前相同的方法：

Process process = Runtime.getRuntime().exec(
        "cmd /c start file.bat",
        null,
        new File("C:\\Users\\User\\Desktop\\"));

这将打开命令提示符，并.bat在我们设置的工作目录中运行文件。

流程构建器

ProcessBuilder是使用该Runtime.getRuntime().exec()方法时运行命令的基本机制：

/**
 * Executes the specified command and arguments in a separate process with
 * the specified environment and working directory.
 *...
*/
public Process exec(String[] cmdarray, String[] envp, File dir) throws IOException {
    return new ProcessBuilder(cmdarray)
        .environment(envp)
        .directory(dir)
        .start();
}

Runtime该类的JavaDocs

看一下如何ProcessBuilder从exec()方法中获取输入并运行命令，也使我们对如何使用它有了一个很好的了解。

它接受一个String[] cmdarray，足以使其运行。另外，我们可以为其提供可选参数，例如String[] envp和File dir。

让我们探索这些选项。
ProcessBuilder：从字符串执行命令

cmd /c dir在这种情况下，我们不得不将其分解，而不是能够提供单个String，例如。例如，如果我们想像以前一样列出目录中的文件，则C:/Users可以执行以下操作：

ProcessBuilder processBuilder = new ProcessBuilder();
processBuilder.command("cmd", "/c", "dir C:\\Users");

Process process = processBuilder.start();
printResults(process);


要实际执行Process，我们运行start()命令并将返回的值分配给Process实例。

运行此代码将产生：

Volume in drive C has no label.
 Volume Serial Number is XXXX-XXXX

 Directory of C:\Users

08/29/2019  05:01 PM    <DIR>          .
08/29/2019  05:01 PM    <DIR>          ..
08/18/2016  09:11 PM    <DIR>          Default.migrated
08/29/2019  05:01 PM    <DIR>          Public
05/15/2020  11:08 AM    <DIR>          User
               0 File(s)              0 bytes
               5 Dir(s)  212,517,294,080 bytes free

但是，这种方法并没有比以前的方法更好。ProcessBuilder该类的有用之处在于它是可自定义的。我们可以以编程方式设置内容，而不仅仅是通过命令。
ProcessBuilder：指定工作目录

与其通过命令提供工作目录，不如通过编程方式进行设置：

processBuilder.command("cmd", "/c", "dir").directory(new File("C:\\Users\\"));

在这里，我们将工作目录设置为与以前相同，但是我们将该定义移出了命令本身。运行此代码将提供与上一个示例相同的结果。
ProcessBuilder：环境变量

使用ProcessBuilders方法，很容易以形式检索环境变量列表Map。设置环境变量也很容易，以便您的程序可以使用它们。

让我们获取当前可用的环境变量，然后添加一些变量供以后使用：

ProcessBuilder processBuilder = new ProcessBuilder();

Map<String, String> environmentVariables  = processBuilder.environment();
environmentVariables.forEach((key, value) -> System.out.println(key + value));

在这里，我们将返回的环境变量打包为aMap并对其运行forEach()，以将值打印到控制台。

运行此代码将产生您在计算机上拥有的环境变量的列表：

DriverDataC:\Windows\System32\Drivers\DriverData
HerokuPathE:\Heroku
ProgramDataC:\ProgramData
...

现在，让我们向该列表添加一个环境变量并使用它：

environmentVariables.put("var1", "value1");

processBuilder.command("cmd", "/c", "echo", "%var1%");
Process process = processBuilder.start();
printResults(process);

运行此代码将产生：

value1

当然，一旦程序完成运行，此变量将不会保留在列表中。
ProcessBuilder：运行.bat和.sh文件

如果您想再次运行文件，我们将为ProcessBuilder实例提供所需的信息：

processBuilder
        .command("cmd", "/c", "start", "file.bat")
        .directory(new File("C:\\Users\\User\\Desktop"));
Process process = processBuilder.start();

运行此代码将导致打开命令提示符并执行.bat文件：