#!/usr/bin/env bash
# Run from the project root, or from the scripts/ subfolder — both work.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

BUNDLE="bundle"
mkdir -p "$BUNDLE"

OK=0
MISSING=0

echo "=== Converting project files to .txt bundle ==="
echo ""

copy_to_bundle() {
  local src="$1"
  local dest="$BUNDLE/$2"
  if [ -f "$src" ]; then
    cp "$src" "$dest"
    echo "  [OK] $src"
    (( OK++ )) || true
  else
    echo "  [!!] MISSING: $src"
    (( MISSING++ )) || true
  fi
}

copy_to_bundle ".eslintrc.cjs"                                                  ".eslintrc.cjs.txt"
copy_to_bundle ".gitignore"                                                     ".gitignore.txt"
copy_to_bundle "eslint.config.cjs"                                              "eslint.config.cjs.txt"
copy_to_bundle "IMPROVEMENTS.md"                                                "IMPROVEMENTS.md.txt"
copy_to_bundle "index.html"                                                     "index.html.txt"
copy_to_bundle "package.json"                                                   "package.json.txt"
copy_to_bundle "package-lock.json"                                              "package-lock.json.txt"
copy_to_bundle "public/robots.txt"                                              "public---robots.txt.txt"
copy_to_bundle "README.md"                                                      "README.md.txt"
copy_to_bundle "REQUIREMENTS.md"                                                "REQUIREMENTS.md.txt"
copy_to_bundle "tsconfig.json"                                                  "tsconfig.json.txt"
copy_to_bundle "vite.config.ts"                                                 "vite.config.ts.txt"
copy_to_bundle "src/env.d.ts"                                                   "src---env.d.ts.txt"
copy_to_bundle "src/main.ts"                                                    "src---main.ts.txt"
copy_to_bundle "src/vite-env.d.ts"                                              "src---vite-env.d.ts.txt"
copy_to_bundle "src/App/style.sass"                                             "src---App---style.sass.txt"
copy_to_bundle "src/App/__tests__/index.a11y.test.ts"                          "src---App---__tests__---index.a11y.test.ts.txt"
copy_to_bundle "src/components/Form/index.html"                                 "src---components---Form---index.html.txt"
copy_to_bundle "src/components/Form/index.ts"                                   "src---components---Form---index.ts.txt"
copy_to_bundle "src/components/Form/style.sass"                                 "src---components---Form---style.sass.txt"
copy_to_bundle "src/components/Form/__tests__/index.a11y.test.ts"              "src---components---Form---__tests__---index.a11y.test.ts.txt"
copy_to_bundle "src/components/SubmissionList/index.html"                       "src---components---SubmissionList---index.html.txt"
copy_to_bundle "src/components/SubmissionList/index.ts"                         "src---components---SubmissionList---index.ts.txt"
copy_to_bundle "src/components/SubmissionList/style.sass"                       "src---components---SubmissionList---style.sass.txt"
copy_to_bundle "src/components/SubmissionList/__tests__/index.a11y.test.ts"    "src---components---SubmissionList---__tests__---index.a11y.test.ts.txt"
copy_to_bundle "src/components/SubmissionList/__tests__/index.test.ts"         "src---components---SubmissionList---__tests__---index.test.ts.txt"
copy_to_bundle "src/styles/theme.sass"                                          "src---styles---theme.sass.txt"
copy_to_bundle "src/test-setup/a11y.ts"                                         "src---test-setup---a11y.ts.txt"
copy_to_bundle "src/test-setup/fixtures.ts"                                     "src---test-setup---fixtures.ts.txt"
copy_to_bundle "src/test-setup/vitest-axe.d.ts"                                "src---test-setup---vitest-axe.d.ts.txt"
copy_to_bundle "src/utils/validation.ts"                                        "src---utils---validation.ts.txt"
copy_to_bundle "src/utils/__tests__/validation.test.ts"                        "src---utils---__tests__---validation.test.ts.txt"

# Include the restore scripts in the bundle
cp "scripts/from_txt.sh"  "$BUNDLE/from_txt.sh"
cp "scripts/from_txt.bat" "$BUNDLE/from_txt.bat"
chmod +x "$BUNDLE/from_txt.sh"

echo ""
echo "Copied:  $OK files"
echo "Missing: $MISSING files"
echo ""
echo "Bundle ready at: $PROJECT_ROOT/$BUNDLE/"
echo "Zip the '$BUNDLE' folder and send by email."
