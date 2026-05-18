#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$(dirname "$SCRIPT_DIR")"

OK=0
MISSING=0

echo "=== Restoring project files from .txt ==="
echo ""

restore() {
  if [ -f "$1" ]; then
    mv "$1" "${1%.txt}"
    echo "  [OK] $1 -> ${1%.txt}"
    (( OK++ )) || true
  else
    echo "  [!!] MISSING: $1"
    (( MISSING++ )) || true
  fi
}

restore ".eslintrc.cjs.txt"
restore ".gitignore.txt"
restore "eslint.config.cjs.txt"
restore "IMPROVEMENTS.md.txt"
restore "index.html.txt"
restore "package.json.txt"
restore "package-lock.json.txt"
restore "public/robots.txt.txt"
restore "README.md.txt"
restore "REQUIREMENTS.md.txt"
restore "tsconfig.json.txt"
restore "vite.config.ts.txt"
restore "src/env.d.ts.txt"
restore "src/main.ts.txt"
restore "src/vite-env.d.ts.txt"
restore "src/App/style.sass.txt"
restore "src/App/__tests__/index.a11y.test.ts.txt"
restore "src/components/Form/index.html.txt"
restore "src/components/Form/index.ts.txt"
restore "src/components/Form/style.sass.txt"
restore "src/components/Form/__tests__/index.a11y.test.ts.txt"
restore "src/components/SubmissionList/index.html.txt"
restore "src/components/SubmissionList/index.ts.txt"
restore "src/components/SubmissionList/style.sass.txt"
restore "src/components/SubmissionList/__tests__/index.a11y.test.ts.txt"
restore "src/components/SubmissionList/__tests__/index.test.ts.txt"
restore "src/styles/theme.sass.txt"
restore "src/test-setup/a11y.ts.txt"
restore "src/test-setup/fixtures.ts.txt"
restore "src/test-setup/vitest-axe.d.ts.txt"
restore "src/utils/validation.ts.txt"
restore "src/utils/__tests__/validation.test.ts.txt"

echo ""
echo "Restored: $OK files"
echo "Missing:  $MISSING files"
