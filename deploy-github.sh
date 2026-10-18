#!/usr/bin/env bash
set -Eeuo pipefail

cd -- "$(dirname -- "$(readlink -f -- "$0")")"

command -v git >/dev/null 2>&1 || {
    echo "Error: Git is not installed."
    exit 1
}

command -v python3 >/dev/null 2>&1 || {
    echo "Error: Python 3 is not installed."
    exit 1
}

echo "=== GitHub Deployment ==="

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git init
    git branch -M main
fi

if ! git remote get-url origin >/dev/null 2>&1; then
    read -r -p "GitHub repository URL: " REMOTE_URL
    [[ -n "$REMOTE_URL" ]] || {
        echo "Remote URL is required."
        exit 1
    }
    git remote add origin "$REMOTE_URL"
fi

VERSION="2.0.1"

if [[ -f package.json ]]; then
    VERSION="$(python3 -c 'import json; print(json.load(open("package.json"))["version"])' 2>/dev/null)" || {
        echo "Could not read package.json version."
        exit 1
    }
fi

echo "Current version: $VERSION"
echo "1. Keep current"
echo "2. Patch bump"
echo "3. Minor bump"
echo "4. Major bump"
read -r -p "Choose [1-4]: " CHOICE
CHOICE="${CHOICE:-1}"

if [[ "$CHOICE" != "1" ]]; then
    [[ "$VERSION" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]] || {
        echo "Version must be MAJOR.MINOR.PATCH."
        exit 1
    }

    MAJOR="${BASH_REMATCH[1]}"
    MINOR="${BASH_REMATCH[2]}"
    PATCH="${BASH_REMATCH[3]}"

    case "$CHOICE" in
        2) PATCH=$((10#$PATCH + 1)) ;;
        3) MINOR=$((10#$MINOR + 1)); PATCH=0 ;;
        4) MAJOR=$((10#$MAJOR + 1)); MINOR=0; PATCH=0 ;;
        *) echo "Invalid choice."; exit 1 ;;
    esac

    VERSION="$MAJOR.$MINOR.$PATCH"

    python3 - "$VERSION" package.json backend/package.json frontend/package.json <<'PY'
import json
import os
import sys
import tempfile

version = sys.argv[1]

for path in sys.argv[2:]:
    if not os.path.isfile(path):
        continue

    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    if "version" not in data:
        print(f"Skipped (no version field): {path}")
        continue

    data["version"] = version
    directory = os.path.dirname(path) or "."
    fd, tmp = tempfile.mkstemp(dir=directory)

    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        os.replace(tmp, path)
    except Exception:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise

    print(f"Updated: {path} -> {version}")
PY
fi

echo
echo "Changed files:"
git status --short

DEFAULT_MSG="Release v$VERSION"
read -r -p "Commit notes (Enter for '$DEFAULT_MSG'): " NOTES

if [[ -n "$NOTES" ]]; then
    COMMIT_MSG="$DEFAULT_MSG - $NOTES"
else
    COMMIT_MSG="$DEFAULT_MSG"
fi

git add -A

if [[ -z "$(git status --porcelain)" ]]; then
    echo "Nothing to commit."
else
    echo
    git diff --cached --stat
    read -r -p "Commit staged changes? [y/N]: " CONFIRM

    case "$CONFIRM" in
        y|Y|yes|YES)
            git commit -m "$COMMIT_MSG"
            ;;
        *)
            echo "Cancelled. Staged changes were preserved."
            exit 0
            ;;
    esac
fi

BRANCH="$(git branch --show-current)"

[[ -n "$BRANCH" ]] || {
    echo "Error: Detached HEAD."
    exit 1
}

echo "Pushing branch: $BRANCH"

if git push -u origin "$BRANCH"; then
    echo "Deployment push completed successfully."
    echo "Version: $VERSION"
else
    echo "Push failed. No force push was attempted."
    echo "Inspect remote history before retrying."
    exit 1
fi
