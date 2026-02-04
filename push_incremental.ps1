$files = git status -uall --porcelain | ForEach-Object { $_.Substring(3).Trim() }

foreach ($file in $files) {
    if ($file -ne "") {
        Write-Host "Processing: $file"
        git add "$file"
        git commit -m "Update $file"
        git push origin main
        Start-Sleep -Seconds 1
    }
}
