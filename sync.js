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

const WEB3D    = process.env.WEB3D_PATH    || 'c:/Engine'
const THREEJS  = process.env.THREEJS_PATH  || 'c:/Engine/THREEJS'
const BABYLON  = process.env.BABYLON_PATH  || 'c:/Engine/BABYLONJS'
const FACTORY  = process.env.FACTORY_PATH  || 'c:/Factory'
const DOCS     = process.env.DOCS_PATH     || 'c:/Edocs'
const PROJECTS = process.env.PROJECTS_PATH || 'c:/Editions/studio-3D'

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

  // Knowledge Base — recursive .md pickup
  ...mdFiles(`${PROJECTS}/_knowledge`, 'knowledge'),

  // Project Bible — README + template files
  [`${PROJECTS}/README.md`,               'projects/index.md'],
  [`${PROJECTS}/_template/index.md`,      'projects/template/index.md'],
  [`${PROJECTS}/_template/01-concept.md`, 'projects/template/01-concept.md'],
  [`${PROJECTS}/_template/02-world.md`,   'projects/template/02-world.md'],
  [`${PROJECTS}/_template/03-characters.md`, 'projects/template/03-characters.md'],
  [`${PROJECTS}/_template/04-art-style.md`,  'projects/template/04-art-style.md'],
  [`${PROJECTS}/_template/05-tech-stack.md`, 'projects/template/05-tech-stack.md'],
  [`${PROJECTS}/_template/06-modules.md`,    'projects/template/06-modules.md'],
  [`${PROJECTS}/_template/07-infrastructure.md`, 'projects/template/07-infrastructure.md'],
  [`${PROJECTS}/_template/08-phases.md`,     'projects/template/08-phases.md'],
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

/**
 * Tìm tất cả .md files đệ quy trong dir, giữ nguyên cấu trúc thư mục.
 * Dùng cho knowledge base, decisions — không chỉ README.md.
 */
function mdFiles(dir, destPrefix) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const srcPath = join(dir, entry.name).replace(/\\/g, '/')
    const destPath = `${destPrefix}/${entry.name}`
    if (entry.isDirectory()) return mdFiles(srcPath, destPath)
    if (entry.name.endsWith('.md')) return [[srcPath, destPath]]
    return []
  })
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
