param(
  [Parameter(Mandatory=$true)][string]$SourceDir,
  [Parameter(Mandatory=$true)][string]$Tag,
  [int]$MaxWidth = 260,
  [int]$Quality = 55
)

Add-Type -AssemblyName System.Drawing

$outRoot = Join-Path $PSScriptRoot "..\thumbs"
$tagDir = Join-Path $outRoot $Tag
New-Item -ItemType Directory -Force -Path $tagDir | Out-Null
$tagDir = (Resolve-Path $tagDir).Path
$SourceDir = (Resolve-Path $SourceDir).Path

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$qualityLong = [int64]$Quality
Write-Host "quality type: $($qualityLong.GetType().FullName) value: $qualityLong"

$files = Get-ChildItem -Path $SourceDir -Filter "*.jpg" | Sort-Object Name
Write-Host "$Tag : $($files.Count) files"

$i = 0
foreach ($f in $files) {
  $dest = Join-Path $tagDir ($f.BaseName + ".jpg")
  $img = $null
  $bmp = $null
  $g = $null
  try {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $ratio = $MaxWidth / $img.Width
    if ($ratio -gt 1) { $ratio = 1 }
    $w = [Math]::Max(1, [int]($img.Width * $ratio))
    $h = [Math]::Max(1, [int]($img.Height * $ratio))
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $w, $h)
    $img.Dispose()
    $img = $null

    $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $qp = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $qualityLong)
    $encParams.Param[0] = $qp
    $bmp.Save($dest, $jpegCodec, $encParams)
    $i++
  } catch {
    Write-Host "Failed: $($f.FullName) :: $($_.Exception.GetType().FullName) :: $($_.Exception.Message)"
  } finally {
    if ($g) { $g.Dispose() }
    if ($bmp) { $bmp.Dispose() }
    if ($img) { $img.Dispose() }
  }
}
Write-Host "Done: $Tag ($i / $($files.Count) succeeded)"
