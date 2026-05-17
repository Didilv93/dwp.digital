@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0\.."

echo === Renaming project files to .txt ===
echo.

set OK=0
set MISSING=0

call :rename ".eslintrc.cjs"
call :rename ".gitignore"
call :rename "eslint.config.cjs"
call :rename "IMPROVEMENTS.md"
call :rename "index.html"
call :rename "package.json"
call :rename "package-lock.json"
call :rename "public\robots.txt"
call :rename "README.md"
call :rename "REQUIREMENTS.md"
call :rename "tsconfig.json"
call :rename "vite.config.ts"
call :rename "src\env.d.ts"
call :rename "src\main.ts"
call :rename "src\vite-env.d.ts"
call :rename "src\App\style.sass"
call :rename "src\App\__tests__\index.a11y.test.ts"
call :rename "src\components\Form\index.html"
call :rename "src\components\Form\index.ts"
call :rename "src\components\Form\style.sass"
call :rename "src\components\Form\__tests__\index.a11y.test.ts"
call :rename "src\components\SubmissionList\index.html"
call :rename "src\components\SubmissionList\index.ts"
call :rename "src\components\SubmissionList\style.sass"
call :rename "src\components\SubmissionList\__tests__\index.a11y.test.ts"
call :rename "src\components\SubmissionList\__tests__\index.test.ts"
call :rename "src\styles\theme.sass"
call :rename "src\test-setup\a11y.ts"
call :rename "src\test-setup\fixtures.ts"
call :rename "src\test-setup\vitest-axe.d.ts"
call :rename "src\utils\validation.ts"
call :rename "src\utils\__tests__\validation.test.ts"

echo.
echo Renamed: %OK% files
echo Missing: %MISSING% files
echo.
pause
goto :eof

:rename
  if exist "%~1" (
    for %%F in ("%~1") do ren "%~1" "%%~nxF.txt"
    echo   [OK] %~1 -^> %~1.txt
    set /a OK+=1
  ) else (
    echo   [!!] MISSING: %~1
    set /a MISSING+=1
  )
goto :eof
