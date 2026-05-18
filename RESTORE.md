# Restoring and packing files

All project source files are renamed with a `.txt` suffix before delivery to comply with DWP email requirements. This file explains how to restore them and, if needed, how to repack them.

> **This file arrives as `RESTORE.md.txt`.** Open it in any text editor before following the steps below.

---

## Restoring files — evaluator

Run **one** of the commands below from the **project root** to rename all `.txt` files back to their originals.

### Windows — PowerShell

```powershell
Get-ChildItem -Recurse -File -Filter "*.txt" |
  Where-Object { $_.FullName -notmatch '\\(scripts|node_modules|\.git|dist|coverage|\.lighthouseci|\.claude|public)\\' } |
  ForEach-Object { Rename-Item -Path $_.FullName -NewName ($_.Name -replace '\.txt$', '') }
```

### Linux / Mac — bash

```bash
find . -type f -name "*.txt" \
  ! -path './scripts/*' \
  ! -path './node_modules/*' \
  ! -path './.git/*' \
  ! -path './dist/*' \
  ! -path './coverage/*' \
  ! -path './.lighthouseci/*' \
  ! -path './.claude/*' \
  ! -path './public/*' \
  | while IFS= read -r f; do mv "$f" "${f%.txt}"; done
```

After restoration, follow the **Getting started** steps in `README.md`.

---

## Packing files for delivery — author only

Use these commands to rename all source files to `.txt` before zipping and sending.

### Windows — PowerShell

```powershell
Get-ChildItem -Recurse -File |
  Where-Object { $_.FullName -notmatch '\\(scripts|node_modules|\.git|dist|coverage|\.lighthouseci|\.claude|public)\\' } |
  Where-Object { $_.Extension -ne '.txt' } |
  ForEach-Object { Rename-Item -Path $_.FullName -NewName ($_.Name + '.txt') }
```

### Linux / Mac — bash

```bash
find . -type f \
  ! -path './scripts/*' \
  ! -path './node_modules/*' \
  ! -path './.git/*' \
  ! -path './dist/*' \
  ! -path './coverage/*' \
  ! -path './.lighthouseci/*' \
  ! -path './.claude/*' \
  ! -path './public/*' \
  ! -name '*.txt' \
  | while IFS= read -r f; do mv "$f" "$f.txt"; done
```
