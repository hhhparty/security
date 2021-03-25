Write-Host "##############################################################"
Write-Host "##### 一个用于批量修改bilibili下载电视剧路径和命名的简单脚本 #####"
Write-Host "##############################################################"


$src_dir = "H:\bilibili\"
$dst_dir = "H:\bilibili\"

#Remove-Item -Path  $dst_dir
#New-Item -Path $dst_dir -ItemType Directory

Set-Location -Path $src_dir
$list = Get-ChildItem -Directory -Name [0-9]*
$ValidDirectoryList = New-Object -TypeName System.Collections.ArrayList

foreach($d in $list){
    Try{
        
        $cfolders = Get-ChildItem (Join-Path $src_dir $d) -Name c_*
        
        foreach($c in $cfolders){
            $path = Join-Path (Join-Path $src_dir $d) $c
            $path = Join-Path $path (Get-ChildItem $path -Name entry.json)
            $a = Get-Content -Path $path  -Raw -Encoding UTF8 | ConvertFrom-Json
            Write-Host $d
            Write-Host $(EscapeChar $a.title)
            Rename-Item $d $(EscapeChar $a.title)
            break
        }
   
        
    }
    Catch{
        Write-Host 'Cannot get number.'
            
    }
    
}

function EscapeChar($str)
{
    return $str -replace "[^\w,\d]" ,""
}

