@echo off
setlocal
cd /d "%~dp0\.."

echo === Restoring project files from .txt ===
echo Working dir: %CD%
echo.

set OK=0
set MISSING=0

call :restore ".eslintrc.cjs.txt"
call :restore ".gitignore.txt"
call :restore "eslint.config.cjs.txt"
call :restore "IMPROVEMENTS.md.txt"
call :restore "index.html.txt"
call :restore "package.json.txt"
call :restore "package-lock.json.txt"
call :restore "public\robots.txt.txt"
call :restore "README.md.txt"
call :restore "REQUIREMENTS.md.txt"
call :restore "tsconfig.json.txt"
call :restore "vite.config.ts.txt"
call :restore "src\env.d.ts.txt"
call :restore "src\main.ts.txt"
call :restore "src\vite-env.d.ts.txt"
call :restore "src\App\style.sass.txt"
call :restore "src\App\__tests__\index.a11y.test.ts.txt"
call :restore "src\components\Form\index.html.txt"
call :restore "src\components\Form\index.ts.txt"
call :restore "src\components\Form\style.sass.txt"
call :restore "src\components\Form\__tests__\index.a11y.test.ts.txt"
call :restore "src\components\SubmissionList\index.html.txt"
call :restore "src\components\SubmissionList\index.ts.txt"
call :restore "src\components\SubmissionList\style.sass.txt"
call :restore "src\components\SubmissionList\__tests__\index.a11y.test.ts.txt"
call :restore "src\components\SubmissionList\__tests__\index.test.ts.txt"
call :restore "src\styles\theme.sass.txt"
call :restore "src\test-setup\a11y.ts.txt"
call :restore "src\test-setup\fixtures.ts.txt"
call :restore "src\test-setup\vitest-axe.d.ts.txt"
call :restore "src\utils\validation.ts.txt"
call :restore "src\utils\__tests__\validation.test.ts.txt"

echo.
echo Restored : %OK%
echo Missing  : %MISSING%
echo.
pause
goto :eof

:restore
  if exist "%~1" (
    for %%F in ("%~1") do ren "%~1" "%%~nF"
    echo   [OK]      %~1
    set /a OK+=1
  ) else (
    echo   [MISSING] %~1
    set /a MISSING+=1
  )
goto :eof
