/**
 * sync.js — Copy MD files từ tất cả projects vào Docs site
 *
 * Chạy: node sync.js
 * Push:  node sync.js --push
 */

import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'fs'
import { join, dirname, basename } from 'path'
import { execSync } from 'child_process'

const PUSH = process.argv.includes('--push')
const DRY  = process.argv.includes('--dry')

// ─── Source roots ────────────────────────────────────────────────────────────

const WEB3D    = 'c:/Web-3D'
const THREEJS  = 'c:/Web-3D/THREEJS'
const BABYLON  = 'c:/Web-3D/BABYLONJS'
const FACTORY  = 'c:/Factory'
const DOCS     = 'c:/Docs'

// ─── Copy map: [source, destination relative to DOCS] ────────────────────────

const FILES = [
  // Ecosystem
  [`${WEB3D}/FACTORY-COMPATIBILITY.md`,  'ecosystem/factory-compatibility.md'],
  [`${WEB3D}/SYNC.md`,                   'ecosystem/sync.md'],

  // Three.js — top-level
  [`${THREEJS}/ROADMAP.md`,              'threejs/index.md'],
  [`${THREEJS}/ARCHITECTURE.md`,         'threejs/architecture.md'],
  [`${THREEJS}/threejs-modules/README.md`, 'threejs/modules.md'],

  // Three.js — effects
  ...readmeFiles(`${THREEJS}/threejs-modules/effects`,   'threejs/effects'),

  // Three.js — shaders
  ...readmeFiles(`${THREEJS}/threejs-modules/shaders/foundation`, 'threejs/shaders/foundation'),
  ...readmeFiles(`${THREEJS}/threejs-modules/shaders/vertex`,     'threejs/shaders/vertex'),
  ...readmeFiles(`${THREEJS}/threejs-modules/shaders/fragment`,   'threejs/shaders/fragment'),

  // Three.js — utils + components
  ...readmeFiles(`${THREEJS}/threejs-modules/utils`,      'threejs/utils'),
  ...readmeFiles(`${THREEJS}/threejs-modules/components`, 'threejs/components'),

  // Babylon.js
  [`${BABYLON}/ROADMAP.md`,  'babylonjs/index.md'],
  [`${BABYLON}/CLAUDE.md`,   'babylonjs/overview.md'],

  // Factory
  [`${FACTORY}/ROADMAP.md`,  'factory/index.md'],
  [`${FACTORY}/CLAUDE.md`,   'factory/overview.md'],
  [`${FACTORY}/SYNC.md`,     'factory/sync.md'],
  [`${FACTORY}/blender/PIPELINE.md`, 'factory/blender/pipeline.md'],
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Tìm README.md trong mỗi subfolder của dir.
 * Trả về mảng [sourcePath, destPath] — bỏ qua _template và node_modules.
 */
function readmeFiles(dir, destPrefix) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter(name => {
      if (name.startsWith('_') || name === 'node_modules') return false
      const full = join(dir, name)
      return statSync(full).isDirectory()
    })
    .map(name => {
      const src  = join(dir, name, 'README.md').replace(/\\/g, '/')
      const dest = `${destPrefix}/${name}.md`
      return [src, dest]
    })
    .filter(([src]) => existsSync(src))
}

function ensureDir(filePath) {
  const dir = dirname(filePath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

// ─── Main ─────────────────────────────────────────────────────────────────────

let copied = 0
let skipped = 0

console.log(`\n📄 Web-3D Docs Sync${DRY ? ' (DRY RUN)' : ''}\n`)

for (const [src, destRel] of FILES) {
  const dest = join(DOCS, destRel)
  if (!existsSync(src)) {
    console.log(`  skip  ${destRel}  (source not found)`)
    skipped++
    continue
  }
  if (!DRY) {
    ensureDir(dest)
    copyFileSync(src, dest)
  }
  console.log(`  copy  ${destRel}`)
  copied++
}

console.log(`\n✓ ${copied} copied, ${skipped} skipped\n`)

// ─── Git push ─────────────────────────────────────────────────────────────────

if (PUSH && !DRY) {
  console.log('📦 Pushing to git...\n')
  try {
    execSync('git add .', { cwd: DOCS, stdio: 'inherit' })
    execSync(`git commit -m "docs: sync ${new Date().toISOString().slice(0, 10)}"`, {
      cwd: DOCS,
      stdio: 'inherit',
    })
    execSync('git push', { cwd: DOCS, stdio: 'inherit' })
    console.log('\n✓ Pushed\n')
  } catch {
    console.log('\n⚠ Nothing to commit or push failed — check git status\n')
  }
}
