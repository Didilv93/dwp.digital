@echo off
setlocal EnableDelayedExpansion

:: Run from project root regardless of where this script lives
cd /d "%~dp0\.."

set BUNDLE=bundle
if not exist "%BUNDLE%" mkdir "%BUNDLE%"

echo === Converting project files to .txt bundle ===
echo.

set OK=0
set MISSING=0

call :copy ".eslintrc.cjs"                                                   ".eslintrc.cjs.txt"
call :copy ".gitignore"                                                       ".gitignore.txt"
call :copy "eslint.config.cjs"                                                "eslint.config.cjs.txt"
call :copy "IMPROVEMENTS.md"                                                  "IMPROVEMENTS.md.txt"
call :copy "index.html"                                                       "index.html.txt"
call :copy "package.json"                                                     "package.json.txt"
call :copy "package-lock.json"                                                "package-lock.json.txt"
call :copy "public\robots.txt"                                                "public---robots.txt.txt"
call :copy "README.md"                                                        "README.md.txt"
call :copy "REQUIREMENTS.md"                                                  "REQUIREMENTS.md.txt"
call :copy "tsconfig.json"                                                    "tsconfig.json.txt"
call :copy "vite.config.ts"                                                   "vite.config.ts.txt"
call :copy "src\env.d.ts"                                                     "src---env.d.ts.txt"
call :copy "src\main.ts"                                                      "src---main.ts.txt"
call :copy "src\vite-env.d.ts"                                                "src---vite-env.d.ts.txt"
call :copy "src\App\style.sass"                                               "src---App---style.sass.txt"
call :copy "src\App\__tests__\index.a11y.test.ts"                            "src---App---__tests__---index.a11y.test.ts.txt"
call :copy "src\components\Form\index.html"                                   "src---components---Form---index.html.txt"
call :copy "src\components\Form\index.ts"                                     "src---components---Form---index.ts.txt"
call :copy "src\components\Form\style.sass"                                   "src---components---Form---style.sass.txt"
call :copy "src\components\Form\__tests__\index.a11y.test.ts"                "src---components---Form---__tests__---index.a11y.test.ts.txt"
call :copy "src\components\SubmissionList\index.html"                         "src---components---SubmissionList---index.html.txt"
call :copy "src\components\SubmissionList\index.ts"                           "src---components---SubmissionList---index.ts.txt"
call :copy "src\components\SubmissionList\style.sass"                         "src---components---SubmissionList---style.sass.txt"
call :copy "src\components\SubmissionList\__tests__\index.a11y.test.ts"      "src---components---SubmissionList---__tests__---index.a11y.test.ts.txt"
call :copy "src\components\SubmissionList\__tests__\index.test.ts"           "src---components---SubmissionList---__tests__---index.test.ts.txt"
call :copy "src\styles\theme.sass"                                            "src---styles---theme.sass.txt"
call :copy "src\test-setup\a11y.ts"                                           "src---test-setup---a11y.ts.txt"
call :copy "src\test-setup\fixtures.ts"                                       "src---test-setup---fixtures.ts.txt"
call :copy "src\test-setup\vitest-axe.d.ts"                                  "src---test-setup---vitest-axe.d.ts.txt"
call :copy "src\utils\validation.ts"                                          "src---utils---validation.ts.txt"
call :copy "src\utils\__tests__\validation.test.ts"                          "src---utils---__tests__---validation.test.ts.txt"

:: Include the restore scripts in the bundle
copy /Y "scripts\from_txt.bat" "%BUNDLE%\from_txt.bat" >nul 2>&1
copy /Y "scripts\from_txt.sh"  "%BUNDLE%\from_txt.sh"  >nul 2>&1

echo.
echo Copied:  %OK% files
echo Missing: %MISSING% files
echo.
echo Bundle ready at: %CD%\%BUNDLE%\
echo Zip the "%BUNDLE%" folder and send by email.
echo.
pause
goto :eof

:copy
  if exist "%~1" (
    copy /Y "%~1" "%BUNDLE%\%~2" >nul 2>&1
    echo   [OK] %~1
    set /a OK+=1
  ) else (
    echo   [!!] MISSING: %~1
    set /a MISSING+=1
  )
goto :eof
