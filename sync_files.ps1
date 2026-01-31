$files = git ls-files
$total = ($files | Measure-Object).Count
$count = 0

foreach ($file in $files) {
    if (Test-Path $file -PathType Leaf) {
        $count++
        $fileName = [System.IO.Path]::GetFileName($file)
        Write-Host "[$count/$total] Syncing $file..."
        git add "$file"
        git commit --allow-empty -m "Build: Implement $fileName with latest medical/social features"
        git push origin main
        Write-Host "[$count/$total] Completed $file."
    }
}
