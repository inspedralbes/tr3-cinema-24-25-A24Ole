#!/bin/bash

##############################################################################
# Fix Broken Packages Script
# 
# Use this if you see "Unable to correct problems, you have held broken packages"
#
# Usage: sudo bash fix-broken-packages.sh
##############################################################################

set -e

echo "🔧 Fixing broken packages..."
echo ""

# Fix broken dependencies
echo "[1/4] Fixing broken package dependencies..."
sudo apt --fix-broken install -y

# Remove unnecessary packages
echo "[2/4] Removing unnecessary packages..."
sudo apt-get autoremove -y

# Clean package cache
echo "[3/4] Cleaning package cache..."
sudo apt-get clean

# Update package lists
echo "[4/4] Updating package lists..."
sudo apt-get update

echo ""
echo "✅ Package repair completed!"
echo ""
echo "Now you can run the setup script again:"
echo "  sudo bash setup-vps.sh"
