##################
# WiFiWeakPwdChecker for Windows10
# 
# Feature:
#     这个程序用于在windows10 下利用wlan 接口卡进行主机所在环境内各wifi ap
#     的密码健壮性。
# 
# Author: 小卒 apawn
# Date: 2022-05-08
##################

Write-Host $ssid
function checkpwd()
{
    Write-Host -NoNewline "To check $ssid's password by netadapter $wifi"
    foreach ($pwd in $PWDs)
        {
            Write-Host -NoNewline "." 
            $spwd = ConvertTo-SecureString $pwd -AsPlainText
            Write-Host -NoNewline "$ssid-$wifi-$pwd" 
            Set-WiFiProfile -ProfileName $ssid -Password $spwd -WiFiAdapterName $wifi  # -ConnectionMode manual -Authentication WPA2PSK -Encryption AES 
         
            Start-Sleep 20
            if ($(Get-NetAdapter -Name $wifi).Status -eq "Up")
            {
                Write-Host -ForegroundColor "Red" "Found it! The AP $ssid is using a weak password: $pwd"
                break
            }
            netsh wlan delete profile name=*
        }
        Write-Host -NoNewline  -ForegroundColor "Green" "[Strong]"  
        Write-Host " "
}


Write-Output "Welcome to use the weak password checker for windows10."


if ( $psversiontable.PSVersion.Major -le 6)
{
    Write-Output "The current version of PowerShell is too low to run the tool."
    Write-Output "To prepare to install Microsoft.PowerShell 7 or more plus ..."
    try
    {
        winget install Microsoft.PowerShell
    }
    catch
    {
        Write-Output "Some error ocurred when execute command 'winget install Microsoft.PowerShell'."
        Write-Output "You can retry it manually after lauching a powershell terminal with Administrator privillege."
    }
    
}

$Interfaces = Get-NetAdapter
if ($($Interfaces.Count) -le 0)
{
    Write-Output "No network interface."
    exit
}
foreach ($if in $Interfaces)
{
    if($if.Name.Tolower().contains("wlan") -or $if.Name.Tolower().contains("wifi") -or $if.Name.Tolower().contains("802.11"))
    {
        $wifi = $if.Name
        Write-Output "Found WiFi Network Interface: $wifi"
    }

}

$APs = Get-WiFiAvailableNetwork -WiFiAdapterName $wifi

Write-Host -ForegroundColor "Green"  "[$(Get-Date)] $($APs.count) WiFi APs is found."

if ( $($APs.count) -eq 0)
{
    #$APs = $(netsh wlan show networks)
    # (netsh wlan show networks | Select-string -pattern "\w*SSID.*: .*" -allmatches).Matches | ForEach-Object {$_.Groups[0].Value}
}

$PWDs = Get-Content "password.csv"

if ($ssid -ne $Null)
{
    Write-Host "--------"
    checkpwd($ssid,$wifi,$PWDs)
}
else {
    foreach ($ap in $APs)
    {
        try
        {
            $ssid = $ap.Dot11Ssid.ucSSID
            
            
            checkpwd($ssid,$wifi,$PWDs)
        }
        catch{
            Write-Output "Some error ocurred."
            Write-Warning "Error: $_"
        }
        #Remove-WiFiProfile -ProfileName $ssid -WiFiAdapterName $wifi
        #netsh wlan delete profile Lt111
    }
}
