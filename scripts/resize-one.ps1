param(
  [Parameter(Mandatory=$true)][string]$Src,
  [Parameter(Mandatory=$true)][string]$Dest,
  [int]$MaxWidth = 900,
  [int]$Quality = 78
)

Add-Type -AssemblyName System.Drawing

$Src = (Resolve-Path $Src).Path
$destDir = Split-Path $Dest -Parent
if ($destDir -and -not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }
$Dest = [System.IO.Path]::GetFullPath($Dest)

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$qualityLong = [int64]$Quality

$img = [System.Drawing.Image]::FromFile($Src)
$ratio = $MaxWidth / $img.Width
if ($ratio -gt 1) { $ratio = 1 }
$w = [Math]::Max(1, [int]($img.Width * $ratio))
$h = [Math]::Max(1, [int]($img.Height * $ratio))
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $w, $h)
$img.Dispose()

$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $qualityLong)
$bmp.Save($Dest, $jpegCodec, $encParams)
$g.Dispose()
$bmp.Dispose()
Write-Host "OK: $Dest ($w x $h)"
