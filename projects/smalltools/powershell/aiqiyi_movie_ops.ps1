Write-Host "##############################################################"
Write-Host "###### 一个用于批量修改爱奇艺下载电视剧路径和命名的简单脚本 #######"
Write-Host "##############################################################"


$src_dir = "h:\zymxxnr"
$dst_dir = "h:\zymxxnr\target"

#Remove-Item -Path  $dst_dir
#New-Item -Path $dst_dir -ItemType Directory

Set-Location -Path $src_dir
$list = Get-ChildItem -Directory -Name *_*
$ValidDirectoryList = New-Object -TypeName System.Collections.ArrayList

foreach($item in $list){
    $s = ($item -split "_")[0]
    if (-not $ValidDirectoryList.Contains($s))
    {
        $ValidDirectoryList.add($s)
    }    
}

Write-Host "Movies will been moved into " + $dst_dir + "...."

foreach($vn in $ValidDirectoryList)
{
    
    $l = Get-ChildItem -Directory -Name ($vn +"_*")
    foreach($n in $l)   
    {
        Set-Location (Join-Path $src_dir $n)
        Try{
            $num = $($(Get-Content  $(Get-ChildItem -Name *.qiyicfg))[-1] -split  "=")[-1]
        }
        Catch{
            Write-Host 'Cannot get number.'
            
        }
        if($num -eq $null)
        {
            $num = Get-Random
        }
        Try{
            $movie_name = (Join-Path $dst_dir $num) + ".qsv" 
            if( $(Get-ChildItem -Name $movie_name) -eq $null)
            {
                Copy-Item -Filter *.qsv -Path $(Get-ChildItem -Name *.qsv) -Destination $movie_name
                Write-Host $movie_name + ' has been moved into ' + $dst_dir + "."
            }
            else
            {
                Write-Host $movie_name + ' exists already.'
            }
            
        }
        Catch{
            Write-Host $movie_name + ' is not exist.'
        }
        $num = $null
        $movie_name = $null
    }
}