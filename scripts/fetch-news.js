/**
 * fetch-news.js — Fetch tin tức Web-3D từ GitHub, npm, Reddit và ghi ra news/index.md
 * Chạy: node scripts/fetch-news.js
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const UA = 'web3d-docs-bot/1.0 (https://github.com/NgQuan86/web3d-docs; educational news aggregator)'

// Múi giờ UTC+7
function nowVN() {
  return new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function dateVN(isoString) {
  if (!isoString) return 'N/A'
  return new Date(isoString).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}

async function safeFetch(url, opts = {}) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, ...opts.headers },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch (e) {
    console.warn(`  warn  ${url} — ${e.message}`)
    return null
  }
}

// ─── Fetchers ────────────────────────────────────────────────────────────────

async function fetchGithubReleases(repo) {
  const data = await safeFetch(`https://api.github.com/repos/${repo}/releases?per_page=3`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!data) return []
  return data.map(r => ({
    version: r.tag_name,
    name: r.name || r.tag_name,
    date: dateVN(r.published_at),
    url: r.html_url,
    body: (r.body || '')
      .split('\n')
      .filter(l => l.trim() && !l.startsWith('#') && !l.match(/^https?:\/\//))
      .slice(0, 1)
      .join(' ')
      .slice(0, 100)
      .trim(),
  }))
}

async function fetchNpm(pkg) {
  const data = await safeFetch(`https://registry.npmjs.org/${pkg}`)
  if (!data) return null
  const version = data['dist-tags']?.latest
  return {
    version,
    date: dateVN(data.time?.[version] ?? null),
  }
}

async function fetchReddit(subreddit) {
  const data = await safeFetch(
    `https://www.reddit.com/r/${subreddit}/hot.json?limit=5&raw_json=1`,
    { headers: { Accept: 'application/json' } }
  )
  if (!data) return []
  return (data.data?.children ?? []).map(c => ({
    title: c.data.title,
    score: c.data.score,
    url: `https://www.reddit.com${c.data.permalink}`,
    author: c.data.author,
  }))
}

// ─── Markdown builder ─────────────────────────────────────────────────────────

function releaseTable(releases) {
  if (!releases.length) return '_Không lấy được dữ liệu._\n'
  return releases.map(r =>
    `| [${r.version}](${r.url}) | ${r.date} | ${r.body || '—'} |`
  ).join('\n')
}

function redditList(posts) {
  if (!posts.length) return '_Không lấy được dữ liệu._\n'
  return posts.map((p, i) =>
    `${i + 1}. **[${p.title}](${p.url})** ↑${p.score} · u/${p.author}`
  ).join('\n')
}

function buildMarkdown({ threejsReleases, babylonReleases, npmThree, npmBabylon, redditThreejs, redditWebgpu }) {
  return `# 📰 Web-3D News

> Cập nhật tự động lúc **${nowVN()}** (UTC+7) · [Nguồn dữ liệu](#nguon-du-lieu)

---

## 🚀 Releases mới nhất

### Three.js

| Phiên bản | Ngày | Ghi chú |
|---|---|---|
${releaseTable(threejsReleases)}

**npm latest:** \`three@${npmThree?.version ?? 'N/A'}\` — ${npmThree?.date ?? ''}

### Babylon.js

| Phiên bản | Ngày | Ghi chú |
|---|---|---|
${releaseTable(babylonReleases)}

**npm latest:** \`babylonjs@${npmBabylon?.version ?? 'N/A'}\` — ${npmBabylon?.date ?? ''}

---

## 💬 Cộng đồng

### r/threejs — Hot posts

${redditList(redditThreejs)}

### r/webgpu — Hot posts

${redditList(redditWebgpu)}

---

## Nguồn dữ liệu {#nguon-du-lieu}

| Nguồn | Link |
|---|---|
| Three.js GitHub | [github.com/mrdoob/three.js](https://github.com/mrdoob/three.js/releases) |
| Babylon.js GitHub | [github.com/BabylonJS/Babylon.js](https://github.com/BabylonJS/Babylon.js/releases) |
| npm three | [npmjs.com/package/three](https://www.npmjs.com/package/three) |
| npm babylonjs | [npmjs.com/package/babylonjs](https://www.npmjs.com/package/babylonjs) |
| r/threejs | [reddit.com/r/threejs](https://www.reddit.com/r/threejs/) |
| r/webgpu | [reddit.com/r/webgpu](https://www.reddit.com/r/webgpu/) |
`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('\n📡 Fetching Web-3D news...\n')

const [threejsReleases, babylonReleases, npmThree, npmBabylon, redditThreejs, redditWebgpu] =
  await Promise.all([
    fetchGithubReleases('mrdoob/three.js'),
    fetchGithubReleases('BabylonJS/Babylon.js'),
    fetchNpm('three'),
    fetchNpm('babylonjs'),
    fetchReddit('threejs'),
    fetchReddit('webgpu'),
  ])

console.log(`  three.js  — ${threejsReleases.length} releases, npm ${npmThree?.version}`)
console.log(`  babylon   — ${babylonReleases.length} releases, npm ${npmBabylon?.version}`)
console.log(`  r/threejs — ${redditThreejs.length} posts`)
console.log(`  r/webgpu  — ${redditWebgpu.length} posts`)

const md = buildMarkdown({ threejsReleases, babylonReleases, npmThree, npmBabylon, redditThreejs, redditWebgpu })

const newsDir = join(ROOT, 'news')
if (!existsSync(newsDir)) mkdirSync(newsDir, { recursive: true })

writeFileSync(join(newsDir, 'index.md'), md, 'utf-8')
console.log('\n✓ news/index.md written\n')
