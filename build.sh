#!/bin/bash

set -e

echo "Updating package.json..."
jq 'del(.workspaces)' package.json > package.json.tmp && mv package.json.tmp package.json
jq '.dependencies["@rolder/ui-kit-react"] = "latest"' package.json > package.json.tmp && mv package.json.tmp package.json
jq '.dependencies["@rolder/ss-presets"] = "latest"' package.json > package.json.tmp && mv package.json.tmp package.json
jq '.dependencies["@rolder/ss-themes"] = "latest"' package.json > package.json.tmp && mv package.json.tmp package.json
jq '.dependencies["@rolder/ss"] = "latest"' package.json > package.json.tmp && mv package.json.tmp package.json

echo "Package.json updated successfully"

echo "Running bun install..."
bun install
bun run build

echo "Done!"
