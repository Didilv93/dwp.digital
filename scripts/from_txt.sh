#!/usr/bin/env bash
# Run this script from the folder containing the .txt files (the unzipped bundle).
# It restores the project into a "dwp.digital" subfolder in the current directory.
set -euo pipefail

PROJECT="dwp.digital"
OK=0
MISSING=0

echo "=== Restoring project from .txt bundle ==="
echo "Output folder: $(pwd)/$PROJECT"
echo ""

restore() {
  local src="$1"
  local dest="$PROJECT/$2"
  mkdir -p "$(dirname "$dest")"
  if [ -f "$src" ]; then
    cp "$src" "$dest"
    echo "  [OK] $2"
    (( OK++ )) || true
  else
    echo "  [!!] MISSING: $src"
    (( MISSING++ )) || true
  fi
}

restore ".eslintrc.cjs.txt"                                                   ".eslintrc.cjs"
restore ".gitignore.txt"                                                      ".gitignore"
restore "eslint.config.cjs.txt"                                               "eslint.config.cjs"
restore "IMPROVEMENTS.md.txt"                                                 "IMPROVEMENTS.md"
restore "index.html.txt"                                                      "index.html"
restore "package.json.txt"                                                    "package.json"
restore "package-lock.json.txt"                                               "package-lock.json"
restore "public---robots.txt.txt"                                             "public/robots.txt"
restore "README.md.txt"                                                       "README.md"
restore "REQUIREMENTS.md.txt"                                                 "REQUIREMENTS.md"
restore "tsconfig.json.txt"                                                   "tsconfig.json"
restore "vite.config.ts.txt"                                                  "vite.config.ts"
restore "src---env.d.ts.txt"                                                  "src/env.d.ts"
restore "src---main.ts.txt"                                                   "src/main.ts"
restore "src---vite-env.d.ts.txt"                                             "src/vite-env.d.ts"
restore "src---App---style.sass.txt"                                          "src/App/style.sass"
restore "src---App---__tests__---index.a11y.test.ts.txt"                     "src/App/__tests__/index.a11y.test.ts"
restore "src---components---Form---index.html.txt"                            "src/components/Form/index.html"
restore "src---components---Form---index.ts.txt"                              "src/components/Form/index.ts"
restore "src---components---Form---style.sass.txt"                            "src/components/Form/style.sass"
restore "src---components---Form---__tests__---index.a11y.test.ts.txt"       "src/components/Form/__tests__/index.a11y.test.ts"
restore "src---components---SubmissionList---index.html.txt"                  "src/components/SubmissionList/index.html"
restore "src---components---SubmissionList---index.ts.txt"                    "src/components/SubmissionList/index.ts"
restore "src---components---SubmissionList---style.sass.txt"                  "src/components/SubmissionList/style.sass"
restore "src---components---SubmissionList---__tests__---index.a11y.test.ts.txt"  "src/components/SubmissionList/__tests__/index.a11y.test.ts"
restore "src---components---SubmissionList---__tests__---index.test.ts.txt"   "src/components/SubmissionList/__tests__/index.test.ts"
restore "src---styles---theme.sass.txt"                                       "src/styles/theme.sass"
restore "src---test-setup---a11y.ts.txt"                                      "src/test-setup/a11y.ts"
restore "src---test-setup---fixtures.ts.txt"                                  "src/test-setup/fixtures.ts"
restore "src---test-setup---vitest-axe.d.ts.txt"                             "src/test-setup/vitest-axe.d.ts"
restore "src---utils---validation.ts.txt"                                     "src/utils/validation.ts"
restore "src---utils---__tests__---validation.test.ts.txt"                   "src/utils/__tests__/validation.test.ts"

echo ""
echo "Restored: $OK files"
echo "Missing:  $MISSING files"
echo ""
echo "Project restored to: $(pwd)/$PROJECT/"
echo "Next step: cd $PROJECT && npm install"
