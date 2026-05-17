@echo off
setlocal EnableDelayedExpansion

:: Run this script from the folder containing the .txt files (the unzipped bundle).
:: It restores the project into a "dwp.digital" subfolder in the current directory.

set PROJECT=dwp.digital
set OK=0
set MISSING=0

echo === Restoring project from .txt bundle ===
echo Output folder: %CD%\%PROJECT%
echo.

:: Create directory structure
mkdir "%PROJECT%"                                                  2>nul
mkdir "%PROJECT%\public"                                           2>nul
mkdir "%PROJECT%\src"                                              2>nul
mkdir "%PROJECT%\src\App"                                          2>nul
mkdir "%PROJECT%\src\App\__tests__"                                2>nul
mkdir "%PROJECT%\src\components"                                   2>nul
mkdir "%PROJECT%\src\components\Form"                              2>nul
mkdir "%PROJECT%\src\components\Form\__tests__"                    2>nul
mkdir "%PROJECT%\src\components\SubmissionList"                    2>nul
mkdir "%PROJECT%\src\components\SubmissionList\__tests__"          2>nul
mkdir "%PROJECT%\src\styles"                                       2>nul
mkdir "%PROJECT%\src\test-setup"                                   2>nul
mkdir "%PROJECT%\src\utils"                                        2>nul
mkdir "%PROJECT%\src\utils\__tests__"                              2>nul

call :restore ".eslintrc.cjs.txt"                                                  ".eslintrc.cjs"
call :restore ".gitignore.txt"                                                      ".gitignore"
call :restore "eslint.config.cjs.txt"                                               "eslint.config.cjs"
call :restore "IMPROVEMENTS.md.txt"                                                 "IMPROVEMENTS.md"
call :restore "index.html.txt"                                                      "index.html"
call :restore "package.json.txt"                                                    "package.json"
call :restore "package-lock.json.txt"                                               "package-lock.json"
call :restore "public---robots.txt.txt"                                             "public\robots.txt"
call :restore "README.md.txt"                                                       "README.md"
call :restore "REQUIREMENTS.md.txt"                                                 "REQUIREMENTS.md"
call :restore "tsconfig.json.txt"                                                   "tsconfig.json"
call :restore "vite.config.ts.txt"                                                  "vite.config.ts"
call :restore "src---env.d.ts.txt"                                                  "src\env.d.ts"
call :restore "src---main.ts.txt"                                                   "src\main.ts"
call :restore "src---vite-env.d.ts.txt"                                             "src\vite-env.d.ts"
call :restore "src---App---style.sass.txt"                                          "src\App\style.sass"
call :restore "src---App---__tests__---index.a11y.test.ts.txt"                     "src\App\__tests__\index.a11y.test.ts"
call :restore "src---components---Form---index.html.txt"                            "src\components\Form\index.html"
call :restore "src---components---Form---index.ts.txt"                              "src\components\Form\index.ts"
call :restore "src---components---Form---style.sass.txt"                            "src\components\Form\style.sass"
call :restore "src---components---Form---__tests__---index.a11y.test.ts.txt"       "src\components\Form\__tests__\index.a11y.test.ts"
call :restore "src---components---SubmissionList---index.html.txt"                  "src\components\SubmissionList\index.html"
call :restore "src---components---SubmissionList---index.ts.txt"                    "src\components\SubmissionList\index.ts"
call :restore "src---components---SubmissionList---style.sass.txt"                  "src\components\SubmissionList\style.sass"
call :restore "src---components---SubmissionList---__tests__---index.a11y.test.ts.txt"  "src\components\SubmissionList\__tests__\index.a11y.test.ts"
call :restore "src---components---SubmissionList---__tests__---index.test.ts.txt"   "src\components\SubmissionList\__tests__\index.test.ts"
call :restore "src---styles---theme.sass.txt"                                       "src\styles\theme.sass"
call :restore "src---test-setup---a11y.ts.txt"                                      "src\test-setup\a11y.ts"
call :restore "src---test-setup---fixtures.ts.txt"                                  "src\test-setup\fixtures.ts"
call :restore "src---test-setup---vitest-axe.d.ts.txt"                             "src\test-setup\vitest-axe.d.ts"
call :restore "src---utils---validation.ts.txt"                                     "src\utils\validation.ts"
call :restore "src---utils---__tests__---validation.test.ts.txt"                   "src\utils\__tests__\validation.test.ts"

echo.
echo Restored: %OK% files
echo Missing:  %MISSING% files
echo.
echo Project restored to: %CD%\%PROJECT%\
echo Next step: cd %PROJECT% ^&^& npm install
echo.
pause
goto :eof

:restore
  if exist "%~1" (
    copy /Y "%~1" "%PROJECT%\%~2" >nul 2>&1
    echo   [OK] %~2
    set /a OK+=1
  ) else (
    echo   [!!] MISSING: %~1
    set /a MISSING+=1
  )
goto :eof
