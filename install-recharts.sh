#!/bin/bash

# This script installs recharts and all its dependencies in a compatible way with React 19
# Run this script when you need to use recharts with React 19

echo "Installing recharts and dependencies for React 19..."

# Install recharts with force flag to override React peer dependency
npm install recharts@latest --force

# Install all required d3 dependencies
npm install d3-array d3-scale d3-shape d3-interpolate d3-color d3-time d3-time-format --force

# Install other dependencies
npm install reselect victory-vendor --force

echo "Installation complete! You may need to restart your development server."
