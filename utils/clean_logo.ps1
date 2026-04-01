Add-Type -AssemblyName System.Drawing
$src = 'C:\Users\Anwender\.gemini\antigravity\brain\401c05be-5573-4c4e-9dee-9ec91aa8830a\media__1774787828162.png'
$dest = 'c:\Users\Anwender\Documents\Antigravity\fmsc-portal\public\logo_clean.png'

if (-Not (Test-Path $src)) {
    Write-Error "Source image not found at $src"
    exit 1
}

$img = [System.Drawing.Image]::FromFile($src)
$bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, 0, 0)
$g.Dispose()
$img.Dispose()

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $p = $bmp.GetPixel($x, $y)
        # 1. Fuzzy transparency for white/grey/light background pixels
        if ($p.R -gt 230 -and $p.G -gt 230 -and $p.B -gt 230) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
        # 2. Convert all remaining (logo) pixels to PURE WHITE
        else {
            $p_new = $bmp.GetPixel($x, $y)
            if ($p_new.A -gt 0) {
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($p_new.A, 255, 255, 255))
            }
        }
    }
}

$bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Success: Cleaned logo saved to $dest"
