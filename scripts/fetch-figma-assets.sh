#!/usr/bin/env bash
# Pulls the original statyk illustration assets straight from Figma.
#
# The asset URLs below are short-lived (Figma signs them for a limited
# window), so this script won't work as-is if much time has passed since
# it was generated — in that case, ask Claude (with Figma MCP connected)
# to re-run `download_assets` on the relevant nodes and regenerate this
# script with fresh URLs.
#
# Usage:
#   chmod +x scripts/fetch-figma-assets.sh
#   ./scripts/fetch-figma-assets.sh

set -e
OUT="public/figma"
mkdir -p "$OUT"

echo "Fetching room + TV illustration assets..."

# Main - Dark frame, full export (reference only, not used directly in code)
curl -sL -o "$OUT/main-dark-reference.png" \
  "https://www.figma.com/api/mcp/asset/6e82da18-eefc-4ef1-990d-fbfb1d8eaa57"

# Individual vector assets (svg) referenced in the "Main - Dark" frame
curl -sL -o "$OUT/room.svg"         "https://www.figma.com/api/mcp/asset/76e6ce1a-20d3-4821-a9d0-228d788ddf25"
curl -sL -o "$OUT/side-window.svg"  "https://www.figma.com/api/mcp/asset/80bdd40f-170e-4e3c-b838-cb6e6062f79b"
curl -sL -o "$OUT/lamp-string.svg"  "https://www.figma.com/api/mcp/asset/6512e977-f72c-41ce-ada5-333c435064f9"
curl -sL -o "$OUT/tv-vector6.svg"   "https://www.figma.com/api/mcp/asset/5bb45044-6008-470e-be18-df709e80b361"
curl -sL -o "$OUT/tv-ellipse2.svg"  "https://www.figma.com/api/mcp/asset/a6330f6f-8872-40ab-a51e-06a92007d3aa"
curl -sL -o "$OUT/tv-group1.svg"    "https://www.figma.com/api/mcp/asset/c3acf9eb-24b5-49cc-8531-1546f9cb5d00"
curl -sL -o "$OUT/volume-slider.svg" "https://www.figma.com/api/mcp/asset/702b0ea6-7c02-4d1a-9db4-f9c6304b4486"
curl -sL -o "$OUT/note.svg"         "https://www.figma.com/api/mcp/asset/7e17c859-e051-4fd5-bc92-0d3a35240d40"
curl -sL -o "$OUT/message.svg"      "https://www.figma.com/api/mcp/asset/e41943b5-7be2-4c8e-87da-a8bd9d022456"
curl -sL -o "$OUT/static-logo.svg"  "https://www.figma.com/api/mcp/asset/bec21ea9-bedf-4260-853b-a6fe5f9684fe"

echo "Done. Assets saved to $OUT/"
echo "Next: swap the hand-authored SVGs in src/components/ for <img src=\"/figma/...\"> tags, or inline the SVG markup directly."
