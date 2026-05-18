# Restoring and packing files

All project source files are renamed with a `.txt` suffix before delivery to comply with DWP email requirements. This file explains how to restore them and, if needed, how to repack them.

> This file (`RESTORE.md`) is intentionally kept out of the conversion manifest and always arrives with its original extension, so it is readable immediately without any prior steps.

---

## Restoring files — evaluator

Run **one** of the commands below from the **project root** to rename all `.txt` files back to their originals.

### Windows — PowerShell

```powershell
Get-ChildItem -Recurse -File -Filter "*.txt" |
  Where-Object { $_.FullName -notmatch '\\(node_modules|\.git|dist|coverage)\\' } |
  ForEach-Object { Rename-Item -Path $_.FullName -NewName ($_.Name -replace '\.txt$', '') }
```

### Linux / Mac — bash

```bash
find . \( -path ./node_modules -o -path ./.git -o -path ./dist -o -path ./coverage \) \
  -prune -o -name "*.txt" -print | while IFS= read -r f; do mv "$f" "${f%.txt}"; done
```

After restoration, follow the **Getting started** steps in `README.md`.

---

## Packing files for delivery — author only

Use these commands to rename all source files to `.txt` before zipping and sending.

### Windows — PowerShell

```powershell
# Root-level files
'.eslintrc.cjs', '.gitignore', 'eslint.config.cjs', 'IMPROVEMENTS.md', 'index.html',
'package.json', 'package-lock.json', 'README.md', 'REQUIREMENTS.md',
'tsconfig.json', 'vite.config.ts' |
  ForEach-Object { if (Test-Path $_) { Rename-Item $_ "$_.txt" } }

# src/ and public/ directories
Get-ChildItem -Recurse -File src, public |
  ForEach-Object { Rename-Item -Path $_.FullName -NewName ($_.Name + '.txt') }
```

### Linux / Mac — bash

```bash
# Root-level files
for f in .eslintrc.cjs .gitignore eslint.config.cjs IMPROVEMENTS.md index.html \
         package.json package-lock.json README.md REQUIREMENTS.md \
         tsconfig.json vite.config.ts; do
  [ -f "$f" ] && mv "$f" "$f.txt"
done

# src/ and public/ directories
find src public -type f | while IFS= read -r f; do mv "$f" "$f.txt"; done
```
