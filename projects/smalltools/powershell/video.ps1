Add-Type -AssemblyName System.Windows.Forms
$Form = New-Object System.Windows.Forms.Form
$Fonts = New-Object System.Drawing.Font("Times New Roman",18,[System.Drawing.FontStyle]::Regular)
$Form.Text = "Video Tools"
$Form.Width =  (([System.Windows.Forms.Screen]::PrimaryScreen).Bounds).Width * 0.4
$Form.Height = (([System.Windows.Forms.Screen]::PrimaryScreen).Bounds).Height * 0.3
$Form.StartPosition = "CenterScreen"

$Label = New-Object System.Windows.Forms.Label
$Label.Text = "Source Directory:"
$Label.Location = New-Object System.Drawing.Point(10,30)
$Label.AutoSize = $True

$SelectSrcTxb = New-Object System.Windows.Forms.TextBox
$SelectSrcTxb.Location = New-Object System.Drawing.Point(230,30)
$SelectSrcTxb.Size = New-Object System.Drawing.Size(200,50)

$SelectSrcBtn = New-Object System.Windows.Forms.Button
$SelectSrcBtn.Text = "Select Video Source Directory"
$SelectSrcBtn.AutoSize = $True
$SelectSrcBtn.Location = New-Object System.Drawing.Point(450,30)


$Form.Controls.Add($Label)
$Form.Controls.Add($SelectSrcBtn)
$Form.Controls.Add($SelectSrcTxb)
$Form.showDialog()



