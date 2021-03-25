######################################################
###    用于批量合成哔哩哔哩下载视频音频文件为MP4   ###
######################################################
$src_path = "H:\bilibili\"

$dir = Get-ChildItem -Path $src_path
$target_path = Join-Path $src_path "target"
mkdir $target_path
$targetPathShell = (New-Object -com Shell.Application).NameSpace($target_path)
foreach( $d in $dir)
{
    $out_path = Join-Path $src_path $d.Name
    $clist = Get-ChildItem $out_path -Name c_*
    $num = 1
    foreach($cd in $clist)
    {
        $layer1_path = Join-Path $out_path  $cd
        $entryjson = Get-Content -Path (Join-Path $layer1_path "entry.json") -Raw -Encoding utf8 |  ConvertFrom-Json
        $out_name = $entryjson.title + $num + ".mp4" 
        #Write-Host $out_name
        
        $c_path =Join-Path  $layer1_path   "64"
        #Write-Host $v_path
        $audio_path = Join-Path $c_path "audio.m4s"
        $video_path = Join-Path $c_path "video.m4s"
        $dest_path = Join-Path $out_path $out_name
        Write-Host $audio_path
        Write-Host $video_path
        Write-Host $dest_path

        if(! (Test-Path -Path $dest_path))
        {
            ffmpeg.exe -i $audio_path -i $video_path -codec copy $dest_path
        }
        else
        {
               
            $targetPathShell.CopyHere($dest_path)
            
         }
        $num = $num+1
    }
    
}