#!/bin/bash

# Script to remove workspaces and update @rolder/ui-kit-react to latest

set -e

echo "Updating package.json..."

# Remove workspaces field from package.json
jq 'del(.workspaces)' package.json > package.json.tmp && mv package.json.tmp package.json

# Replace @rolder/ui-kit-react workspace reference with latest
jq '.dependencies["@rolder/ui-kit-react"] = "latest"' package.json > package.json.tmp && mv package.json.tmp package.json

echo "Package.json updated successfully"

echo "Running bun install..."
bun install

echo "Done!"
