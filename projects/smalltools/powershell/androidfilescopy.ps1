Write-Host "####################################################################"
Write-Host "##  A tool of auto copy moviefiles form android phone to computer ##"
Write-Host "####################################################################"
Write-Host "Start the script...."
Write-Host " "

#$destPath = "H:\bilibili"
#$phoneName = "Lt"
#$phoneFilePath = "内部存储\Android\data\tv.danmaku.bili\download"
$destPath = "M:\aiqiyi"
$phoneName = "Lt"
$phoneFilePath = "内部存储\Android\data\com.qiyi.video\files\app\download\video"

$summary = [hashtable]@{CopyCount=0;ExistedCount=0}

function getPhoneRootPath($phoneName)
{
    Try{
        $shellApp = New-Object -com Shell.Application
        $computerRootFolder = $shellApp.NameSpace(0x11) #https://docs.microsoft.com/en-us/windows/win32/api/shldisp/ne-shldisp-shellspecialfolderconstants
        $phoneRootPath = $computerRootFolder.Items() | Where-Object {$_.Name -eq $phoneName} | select -First 1   
        if($phoneRootPath -eq $null)
        {
            throw "$phoneRootPath is not found in this computer, please check the connect and phone's options"
        }
        else
        {
            Write-Host "The root path of " + $phoneName + "is : "+ $phoneRootPath.Path
        }
    }
    Catch
    {
        Write-Host "When getting the root path of " + $phoneName + ", some exception rasied."
    }
    return $phoneRootPath
}

function getPhoneFilesPath($phoneRootPath,$phoneFilePath)
{
    $r = $phoneRootPath
    if ($r -eq $null)
    {
        "The root path of " + $phoneName + "is null. Please check if the connection and phone name is ok firstlly."
    }
    Try
    {
        foreach($item in ($phoneFilePath -split "\\"))
        {
            
            $a = $r.GetFolder.Items() |Where-Object {$_.Name -eq $item} | select -First 1  
            $r = $a
            
            if($r -eq $null)
            {
                throw "$phoneFilePath does not exist. Please check it again."
            }
                  
        }
    }
    Catch
    {
        Write-Host "When getting the wanted path of " + $phoneFilePath + ", some exception rasied."
    }
    return $a
}

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

function copyfiles($desPath,$srcPath)
{
    createFolder $destPath
    $destPathShell = (New-Object -com Shell.Application).NameSpace($destPath)
    $copyCount = 0
    $existedCount = 0

    Write-Host "Start copy files from $srcPath to $destPath..."
 
    foreach ($i in $srcPath.GetFolder.Items() )
    {
        $fileName = $i.Name
        $filePath = Join-Path -Path $destPath -ChildPath $fileName

        if($item.IsFolder)
        {
            copyfiles $filePath $i 
                
        }
        elseif(Test-Path $filePath)
        {
            Write-Host "$filePath already exists."
            $existedCount++;
        }
        else
        {
            Write-Host "To copy $filePath from $srcPath to $desPath..."
            $destPathShell.CopyHere($i)
            $copyCount++;
        }
    }
    $script:Summary.CopyCount += $copyCount
    $script:Summary.ExistedCount += $existedCount
    Write-Host "Copy done! Copy Count is $copyCount and Existed Count is $existedCount."
   

}
$movie_files = getPhoneFilesPath (getPhoneRootPath $phoneName) $phoneFilePath
copyfiles $destPath $movie_files
Write-Host ($summary | out-string)