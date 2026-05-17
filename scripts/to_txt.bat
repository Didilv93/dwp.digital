@echo off
setlocal
cd /d "%~dp0\.."

echo === Renaming project files to .txt ===
echo Working dir: %CD%
echo.

set OK=0
set MISSING=0

call :ren ".eslintrc.cjs"
call :ren ".gitignore"
call :ren "eslint.config.cjs"
call :ren "IMPROVEMENTS.md"
call :ren "index.html"
call :ren "package.json"
call :ren "package-lock.json"
call :ren "public\robots.txt"
call :ren "README.md"
call :ren "REQUIREMENTS.md"
call :ren "tsconfig.json"
call :ren "vite.config.ts"
call :ren "src\env.d.ts"
call :ren "src\main.ts"
call :ren "src\vite-env.d.ts"
call :ren "src\App\style.sass"
call :ren "src\App\__tests__\index.a11y.test.ts"
call :ren "src\components\Form\index.html"
call :ren "src\components\Form\index.ts"
call :ren "src\components\Form\style.sass"
call :ren "src\components\Form\__tests__\index.a11y.test.ts"
call :ren "src\components\SubmissionList\index.html"
call :ren "src\components\SubmissionList\index.ts"
call :ren "src\components\SubmissionList\style.sass"
call :ren "src\components\SubmissionList\__tests__\index.a11y.test.ts"
call :ren "src\components\SubmissionList\__tests__\index.test.ts"
call :ren "src\styles\theme.sass"
call :ren "src\test-setup\a11y.ts"
call :ren "src\test-setup\fixtures.ts"
call :ren "src\test-setup\vitest-axe.d.ts"
call :ren "src\utils\validation.ts"
call :ren "src\utils\__tests__\validation.test.ts"

echo.
echo Renamed : %OK%
echo Missing : %MISSING%
echo.
pause
goto :eof

:ren
  if exist "%~1" (
    for %%F in ("%~1") do ren "%~1" "%%~nxF.txt"
    echo   [OK]      %~1
    set /a OK+=1
  ) else (
    echo   [MISSING] %~1
    set /a MISSING+=1
  )
goto :eof
