# Script tải ảnh kính mắt thực tế từ internet
# Chạy: .\download_images.ps1

$outputDir = "d:\DATN_KinhMat\abc\API_CuahangKinhmat\API_Kinhmat\wwwroot\images\product"

# Danh sách ảnh cần tải (nguồn: Unsplash - free to use)
$images = @{
    # Kính cận
    "kinh_can_essilor.jpg"    = "https://images.unsplash.com/photo-1574258495973-f7977a3346ff?w=600&q=80"
    "kinh_can_hoya.jpg"       = "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80"
    "kinh_can_zeiss.jpg"      = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"
    "kinh_can_chemi.jpg"      = "https://images.unsplash.com/photo-1591069876032-ae4e4e0e5002?w=600&q=80"
    "kinh_can_nikon.jpg"      = "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80"
    "kinh_can_crizal.jpg"     = "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80"
    "kinh_can_rodenstock.jpg"  = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80"
    "kinh_can_basic.jpg"      = "https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=600&q=80"
    "kinh_can_hoya_sync.jpg"  = "https://images.unsplash.com/photo-1632161244911-78bcc4f1b358?w=600&q=80"
    "kinh_can_transitions.jpg"= "https://images.unsplash.com/photo-1625591342274-013866677848?w=600&q=80"

    # Kính râm
    "kinh_ram_aviator.jpg"    = "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80"
    "kinh_ram_wayfarer.jpg"   = "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80"
    "kinh_ram_gucci.jpg"      = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"
    "kinh_ram_oakley.jpg"     = "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80"
    "kinh_ram_bolon.jpg"      = "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80"
    "kinh_ram_dior.jpg"       = "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&q=80"
    "kinh_ram_prada.jpg"      = "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80"
    "kinh_ram_versace.jpg"    = "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80"
    "kinh_ram_gentle.jpg"     = "https://images.unsplash.com/photo-1619859421076-dc6ad9e0e1e4?w=600&q=80"
    "kinh_ram_uv400.jpg"      = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"

    # Kính thời trang
    "kinh_tt_harry.jpg"       = "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80"
    "kinh_tt_clubmaster.jpg"  = "https://images.unsplash.com/photo-1574258495973-f7977a3346ff?w=600&q=80"
    "kinh_tt_polygon.jpg"     = "https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=600&q=80"
    "kinh_tt_matmeo.jpg"      = "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80"
    "kinh_tt_oversized.jpg"   = "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80"
    "kinh_tt_trongsuot.jpg"   = "https://images.unsplash.com/photo-1632161244911-78bcc4f1b358?w=600&q=80"
    "kinh_tt_nuagong.jpg"     = "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80"
    "kinh_tt_ulzzang.jpg"     = "https://images.unsplash.com/photo-1625591342274-013866677848?w=600&q=80"

    # Kính bảo hộ
    "kinh_bh_3m.jpg"          = "https://images.unsplash.com/photo-1585314540237-57d498a3d736?w=600&q=80"
    "kinh_bh_honeywell.jpg"   = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"
    "kinh_bh_uvex.jpg"        = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80"
    "kinh_bh_bolle.jpg"       = "https://images.unsplash.com/photo-1585314540237-57d498a3d736?w=600&q=80"
    "kinh_bh_yte.jpg"         = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"

    # Kính lão
    "kinh_lao_docsach.jpg"    = "https://images.unsplash.com/photo-1574258495973-f7977a3346ff?w=600&q=80"
    "kinh_lao_essilor.jpg"    = "https://images.unsplash.com/photo-1591069876032-ae4e4e0e5002?w=600&q=80"
    "kinh_lao_gapgon.jpg"     = "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80"
    "kinh_lao_hoya.jpg"       = "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80"
    "kinh_lao_led.jpg"        = "https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=600&q=80"

    # Kính áp tròng
    "lens_acuvue_1day.jpg"    = "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&q=80"
    "lens_freshlook.jpg"      = "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&q=80"
    "lens_olens.jpg"          = "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&q=80"
    "lens_acuvue_oasys.jpg"   = "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&q=80"
    "lens_bausch.jpg"         = "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&q=80"
    "lens_duna.jpg"           = "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&q=80"

    # Gọng kính
    "gong_titanium.jpg"       = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80"
    "gong_tr90.jpg"           = "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80"
    "gong_acetate.jpg"        = "https://images.unsplash.com/photo-1574258495973-f7977a3346ff?w=600&q=80"
    "gong_chrome.jpg"         = "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&q=80"
    "gong_silhouette.jpg"     = "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80"
    "gong_nhua_mau.jpg"       = "https://images.unsplash.com/photo-1625591342274-013866677848?w=600&q=80"
    "gong_memory.jpg"         = "https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=600&q=80"

    # Kính trẻ em
    "kinh_te_nano.jpg"        = "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80"
    "kinh_te_uv400.jpg"       = "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80"
    "kinh_te_bluelight.jpg"   = "https://images.unsplash.com/photo-1632161244911-78bcc4f1b358?w=600&q=80"
    "kinh_te_boi.jpg"         = "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80"

    # Blog
    "blog_ram_hot.jpg"        = "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80"
    "blog_chon_kinh.jpg"      = "https://images.unsplash.com/photo-1574258495973-f7977a3346ff?w=600&q=80"
    "blog_bao_quan.jpg"       = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80"
    "blog_anh_sang.jpg"       = "https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=600&q=80"
    "blog_review_essilor.jpg" = "https://images.unsplash.com/photo-1591069876032-ae4e4e0e5002?w=600&q=80"
    "blog_lens.jpg"           = "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&q=80"
    "blog_xu_huong.jpg"       = "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80"
    "blog_can_thi.jpg"        = "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80"
    "blog_so_sanh.jpg"        = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"
    "blog_chinh_hang.jpg"     = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"
}

$total = $images.Count
$count = 0
$failed = 0

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Bat dau tai $total anh san pham..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

foreach ($entry in $images.GetEnumerator()) {
    $count++
    $filePath = Join-Path $outputDir $entry.Key
    
    # Bo qua neu anh da ton tai
    if (Test-Path $filePath) {
        Write-Host "[$count/$total] Da co: $($entry.Key)" -ForegroundColor Yellow
        continue
    }
    
    try {
        Write-Host "[$count/$total] Dang tai: $($entry.Key)..." -ForegroundColor Green -NoNewline
        Invoke-WebRequest -Uri $entry.Value -OutFile $filePath -TimeoutSec 15 -ErrorAction Stop
        $size = [math]::Round((Get-Item $filePath).Length / 1KB)
        Write-Host " OK (${size}KB)" -ForegroundColor Green
    }
    catch {
        $failed++
        Write-Host " LOI!" -ForegroundColor Red
        Write-Host "  -> $($_.Exception.Message)" -ForegroundColor DarkRed
    }
    
    # Delay nhe de tranh bi rate limit
    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Hoan tat!" -ForegroundColor Cyan
Write-Host "  Thanh cong: $($count - $failed)/$total" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "  That bai: $failed" -ForegroundColor Red
}
Write-Host "  Thu muc: $outputDir" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
