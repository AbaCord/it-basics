param(
    [Parameter(Mandatory = $true)]
    [string]$Locale,

    [Parameter(Mandatory = $true)]
    [string]$ChallengeId
)

$file = "src/messages/$Locale.json"
$tmpMd = [System.IO.Path]::GetTempFileName() + ".md"
$tmpJson = [System.IO.Path]::GetTempFileName()

try {
    if (-not (Test-Path $file)) {
        Write-Error "Locale file '$file' not found"
        exit 1
    }

    $exists = jq -e --arg id $ChallengeId `
        '.Challenges[$id].description != null' `
        $file 2>$null

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Challenge '$ChallengeId' not found in locale '$Locale'"
        exit 1
    }

    jq -r --arg id $ChallengeId `
        '.Challenges[$id].description' `
        $file | Set-Content -Encoding utf8 $tmpMd

    $editor = if ($env:EDITOR) {
        $env:EDITOR
    } else {
        "notepad"
    }

    & $editor $tmpMd

    jq --rawfile description $tmpMd `
        --arg id $ChallengeId `
        '.Challenges[$id].description = $description' `
        $file | Set-Content -Encoding utf8 $tmpJson

    Move-Item -Force $tmpJson $file

    Write-Host "Updated $Locale/$ChallengeId description"
}
finally {
    Remove-Item -Force -ErrorAction SilentlyContinue $tmpMd
    Remove-Item -Force -ErrorAction SilentlyContinue $tmpJson
}
