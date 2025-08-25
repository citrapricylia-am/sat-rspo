#!/bin/bash

# Vercel Build Script for CommonJS Deployment
echo "🔧 Starting CommonJS build process..."

# Remove any potential ES module remnants
echo "🧹 Cleaning potential ES module files..."
find . -name "*.mjs" -type f -delete 2>/dev/null || true
find . -name "*.esm.js" -type f -delete 2>/dev/null || true

# Ensure package.json is CommonJS
echo "📦 Ensuring CommonJS package.json..."
echo '{
  "name": "sat-rspo-padi-vercel",
  "private": true,
  "version": "1.0.0",
  "type": "commonjs",
  "main": "index.cjs",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.7",
    "cors": "^2.8.5"
  }
}' > package.json

# Create CommonJS tsconfig for deployment
echo "⚙️ Creating deployment TypeScript config..."
echo '{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": false,
    "outDir": "./dist",
    "rootDir": "./api"
  },
  "include": ["api/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.mjs", "**/*.esm.js"]
}' > tsconfig.json

echo "✅ CommonJS build preparation complete!"