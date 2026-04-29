#!/bin/bash
set -euo pipefail

bun run build

cp db.json dist/
cp -r --parents $(git ls-files) dist/

