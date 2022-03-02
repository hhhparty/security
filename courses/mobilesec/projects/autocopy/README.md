# README

这是一个自动访问Android设备指定目录并完成文件拷贝的小程序。

## 动机（Motivation）

### 原始想法 Original
最初的想法是以最简方式将手机中某个路径下存放的文件拷贝到电脑指定目录下。

例如：启动程序后，将手机通过USB连接到电脑并授权后，即启动拷贝过程。

## 实现 Implementation

### Windows 访问便携设备

Windows 访问便携设备使用了 User-Mode Driver Framework (UMDF)，而不是磁盘管理方式。所以路径里没有盘符。所以我们需要借助 Windows Shell 的 [Shell Objects for Scripting](https://docs.microsoft.com/en-us/windows/win32/shell/objects) 中的 shell对象的 application对象。这个对象可以查看基于各种协议连接的设备。本案中使用的协议是UMDF 的 MTP协议。

NameSpace(0x11) #https://docs.microsoft.com/en-us/windows/win32/api/shldisp/ne-shldisp-shellspecialfolderconstants


## Usage

- 使用USB连接线连接windows和android设备；
- 然后查看手机上弹出的“USB连接方式”中，选中“传输文件”。

```
#
#
#
$srcPath = "h:\video"
$destPath = "h:\aiqiyi"

function createFolder($path)
{
    if(! (Test-Path -Path $path))
    {
        Write-Host "To create folder: '$path'"
        New-Item -Path $path -ItemType Directory
    }
    else
    {
        Write-Host "'$path' already exists."
    }

}

function moveFiles($destPath,$srcPath)
{
    createFolder $destPath
    Set-Location $srcPath
    $items = Get-ChildItem -Directory -Name *_*
    foreach($item in $items)
    {
        #to create a folder 
        $newfolder =  ($item -split "_")[0]
        $nfPath = Join-Path -Path $destPath -ChildPath $newfolder
        createFolder $nfPath
        $destPathShell = (New-Object -com Shell.Application).NameSpace($nfPath)

        getQiyiVideoFiles $item
        #$destPathShell.GetFolder.MoveHere($pp)

    }
}

function getQiyiVideoFiles($foldername)
{
    $list = Get-ChildItem -Name $foldername 
    foreach($item in $list)
    {
        if $item
    }
}

moveFiles $destPath $srcPath

```

```
$destPath = "H:/aqiyi"
$phoneName = "Lt"
$phoneFilePath = "内部存储\Android\data\com.qiyi.video\files\app\download\video"
$summary = [hashtable]@{CopyCount=0;ExistedCount=0}

##$phoneDir = $rcd.Items() | Where-Object {$_.Name -eq $phoneName} | select -First 1



function createFolder($path)
{
    if(! (Test-Path -Path $path))
    {
        Write-Host "To create folder: '$path'"
        New-Item -Path $path -ItemType Directory
    }
    else
    {
        Write-Host "'$path' already exists."
    }

}


function getPhoneRootPath($phoneName)
{
    $shellApp = New-Object -com Shell.Application
    $computerRootFolder = $shellApp.NameSpace(0x11) #https://docs.microsoft.com/en-us/windows/win32/api/shldisp/ne-shldisp-shellspecialfolderconstants
    $phoneRootPath = $computerRootFolder.Items() | Where-Object {$_.Name -eq $phoneName} | select -First 1
    
    if($phoneRootPath -eq $null)
    {
        throw "$phoneRootPath is not found in this computer, please check the connect and phone's options"

    }
    return $phoneRootPath
}

function getPhoneFilesPath($phoneRootPath,$phoneFilePath)
{
    $r = $phoneRootPath
    foreach($item in ($phoneFilePath -split "\\"))
    {
        
        $r = $r.GetFolder.Items() |Where-Object {$_.Name -eq $item} #| select -First 1
        
        if($r -eq $null)
        {
            throw "$phoneFilePath does not exist. Please check it again."
        }        
    }
    return $r
}


function copyfiles($desPath,$srcPath)
{
    createFolder $destPath
    $destPathShell = (New-Object -com Shell.Application).NameSpace($destPath)
    $copyCount = 0
    $existedCount = 0

    Write-Host "Start copy files from $srcPath to $destPath..."
 
    foreach ($item in $srcPath.GetFolder.Items() )
    {
        $fileName = $item.Name
        $filePath = Join-Path -Path $destPath -ChildPath $fileName

        if($item.IsFolder)
        {
            copyfiles $filePath $item 
                
        }
        elseif(Test-Path $filePath)
        {
            Write-Host "$filePath already exists."
            $existedCount++;
        }
        else
        {
            Write-Host "To copy $filePath from $srcPath to $desPath..."
            #$destPathShell.CopyHere($item)
            $copyCount++;
        }
    }
    $script:Summary.CopyCount += $copyCount
    $script:Summary.ExistedCount += $existedCount
    Write-Host "Copy done! Copy Count is $copyCount and Existed Count is $existedCount."
   

}
#$r = (getPhoneFilesPath (getPhoneRootPath $phoneName) $phoneFilePath) 
#$r
copyfiles $destPath (getPhoneFilesPath (getPhoneRootPath $phoneName) $phoneFilePath) 
#createFolder $destPath
#$destPathShell = (New-Object -com Shell.Application).NameSpace($destPath)
#$destPathShell
Write-Host ($summary | out-string)

```