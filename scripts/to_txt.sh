#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$(dirname "$SCRIPT_DIR")"

OK=0
MISSING=0

echo "=== Renaming project files to .txt ==="
echo ""

rename_to_txt() {
  if [ -f "$1" ]; then
    mv "$1" "$1.txt"
    echo "  [OK] $1 -> $1.txt"
    (( OK++ )) || true
  else
    echo "  [!!] MISSING: $1"
    (( MISSING++ )) || true
  fi
}

rename_to_txt ".eslintrc.cjs"
rename_to_txt ".gitignore"
rename_to_txt "eslint.config.cjs"
rename_to_txt "IMPROVEMENTS.md"
rename_to_txt "index.html"
rename_to_txt "package.json"
rename_to_txt "package-lock.json"
rename_to_txt "public/robots.txt"
rename_to_txt "README.md"
rename_to_txt "REQUIREMENTS.md"
rename_to_txt "tsconfig.json"
rename_to_txt "vite.config.ts"
rename_to_txt "src/env.d.ts"
rename_to_txt "src/main.ts"
rename_to_txt "src/vite-env.d.ts"
rename_to_txt "src/App/style.sass"
rename_to_txt "src/App/__tests__/index.a11y.test.ts"
rename_to_txt "src/components/Form/index.html"
rename_to_txt "src/components/Form/index.ts"
rename_to_txt "src/components/Form/style.sass"
rename_to_txt "src/components/Form/__tests__/index.a11y.test.ts"
rename_to_txt "src/components/SubmissionList/index.html"
rename_to_txt "src/components/SubmissionList/index.ts"
rename_to_txt "src/components/SubmissionList/style.sass"
rename_to_txt "src/components/SubmissionList/__tests__/index.a11y.test.ts"
rename_to_txt "src/components/SubmissionList/__tests__/index.test.ts"
rename_to_txt "src/styles/theme.sass"
rename_to_txt "src/test-setup/a11y.ts"
rename_to_txt "src/test-setup/fixtures.ts"
rename_to_txt "src/test-setup/vitest-axe.d.ts"
rename_to_txt "src/utils/validation.ts"
rename_to_txt "src/utils/__tests__/validation.test.ts"

echo ""
echo "Renamed: $OK files"
echo "Missing: $MISSING files"
