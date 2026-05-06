import { defineConfig, Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// Plugin that inlines images from /src/imports/ as base64 data URLs.
// This guarantees images load in all preview modes (dev, large preview, build).
function inlineImportsImages(): Plugin {
  const importsDir = path.resolve(__dirname, './src/imports')
  return {
    name: 'inline-imports-images',
    enforce: 'pre',
    load(id) {
      // Strip query params and hash, then decode percent-encoded chars safely
      let filePath = id.split('?')[0].split('#')[0]
      try {
        filePath = decodeURIComponent(filePath)
      } catch {
        // If decoding fails, use the raw path as-is
      }
      if (
        filePath.startsWith(importsDir) &&
        /\.(png|jpe?g)$/i.test(filePath)
      ) {
        try {
          const data = fs.readFileSync(filePath)
          const ext = /\.png$/i.test(filePath) ? 'png' : 'jpeg'
          const b64 = data.toString('base64')
          return `export default "data:image/${ext};base64,${b64}"`
        } catch {
          return null
        }
      }
      return null
    },
  }
}


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    inlineImportsImages(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Pre-bundle Firebase so Vite correctly resolves its browser ESM exports
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
    ],
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})