param(
  [Parameter(Mandatory=$true)][string]$ThumbDir,
  [Parameter(Mandatory=$true)][string]$OutFile,
  [int]$Cols = 8,
  [int]$CellW = 260,
  [int]$CellH = 173,
  [int]$Pad = 4,
  [int]$LabelH = 16
)

Add-Type -AssemblyName System.Drawing

$ThumbDir = (Resolve-Path $ThumbDir).Path
$files = Get-ChildItem -Path $ThumbDir -Filter "*.jpg" | Sort-Object Name
$n = $files.Count
$rows = [Math]::Ceiling($n / $Cols)

$cellTotalH = $CellH + $LabelH
$W = $Cols * ($CellW + $Pad) + $Pad
$H = $rows * ($cellTotalH + $Pad) + $Pad

$sheet = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.Clear([System.Drawing.Color]::White)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font "Arial", 8
$brush = [System.Drawing.Brushes]::Black

for ($i = 0; $i -lt $n; $i++) {
  $f = $files[$i]
  $col = $i % $Cols
  $row = [Math]::Floor($i / $Cols)
  $x = $Pad + $col * ($CellW + $Pad)
  $y = $Pad + $row * ($cellTotalH + $Pad)
  try {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $ratio = [Math]::Min($CellW / $img.Width, $CellH / $img.Height)
    $w = [int]($img.Width * $ratio)
    $h = [int]($img.Height * $ratio)
    $ox = $x + [int](($CellW - $w) / 2)
    $oy = $y + [int](($CellH - $h) / 2)
    $g.DrawImage($img, $ox, $oy, $w, $h)
    $img.Dispose()
  } catch {
    Write-Host "skip $($f.Name): $_"
  }
  $label = [System.IO.Path]::GetFileNameWithoutExtension($f.Name) -replace '^R5_', ''
  $g.DrawString("$i : $label", $font, $brush, $x, $y + $CellH)
}

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]70)
$OutFile = [System.IO.Path]::GetFullPath($OutFile)
$sheet.Save($OutFile, $jpegCodec, $encParams)
$g.Dispose()
$sheet.Dispose()
Write-Host "Wrote $OutFile ($n images, $Cols x $rows grid)"
