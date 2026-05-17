import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Web-3D Docs',
  description: 'Three.js · Babylon.js · Factory pipeline documentation',
  lang: 'vi',

  // Links trong source MD trỏ về project gốc — không valid trong docs site
  ignoreDeadLinks: true,

  // Nhiều file MD từ project có <T> generic và `< 100` — không parse như HTML
  markdown: {
    html: false,
  },

  themeConfig: {
    nav: [
      { text: 'Ecosystem', link: '/ecosystem/' },
      { text: 'Three.js', link: '/threejs/' },
      { text: 'Babylon.js', link: '/babylonjs/' },
      { text: 'Factory', link: '/factory/' },
      { text: 'News', link: '/news/' },
      { text: 'Projects', link: '/projects/' },
    ],

    sidebar: {
      '/ecosystem/': [
        {
          text: 'Ecosystem',
          items: [
            { text: 'Overview', link: '/ecosystem/' },
            { text: 'Factory Compatibility', link: '/ecosystem/factory-compatibility' },
            { text: 'Sync Log', link: '/ecosystem/sync' },
          ],
        },
      ],

      '/threejs/': [
        {
          text: 'Three.js',
          items: [
            { text: 'Roadmap', link: '/threejs/' },
            { text: 'Architecture', link: '/threejs/architecture' },
            { text: 'Modules', link: '/threejs/modules' },
          ],
        },
        {
          text: 'Effects',
          collapsed: false,
          items: [
            { text: 'BaseGPUEffect', link: '/threejs/effects/BaseGPUEffect' },
            { text: 'BeamEffect', link: '/threejs/effects/BeamEffect' },
            { text: 'BillboardSprite', link: '/threejs/effects/BillboardSprite' },
            { text: 'FireSystem', link: '/threejs/effects/FireSystem' },
            { text: 'GPUParticleSystem', link: '/threejs/effects/GPUParticleSystem' },
            { text: 'ShockwaveRing', link: '/threejs/effects/ShockwaveRing' },
            { text: 'SparkSystem', link: '/threejs/effects/SparkSystem' },
            { text: 'TrailSystem', link: '/threejs/effects/TrailSystem' },
          ],
        },
        {
          text: 'Shaders — Foundation',
          collapsed: true,
          items: [
            { text: 'BaseShaderMaterial', link: '/threejs/shaders/foundation/BaseShaderMaterial' },
            { text: 'WorldNoise', link: '/threejs/shaders/foundation/WorldNoise' },
          ],
        },
        {
          text: 'Shaders — Vertex',
          collapsed: true,
          items: [
            { text: 'ProceduralFracture', link: '/threejs/shaders/vertex/ProceduralFracture' },
            { text: 'VATShader', link: '/threejs/shaders/vertex/VATShader' },
            { text: 'WindAnimation', link: '/threejs/shaders/vertex/WindAnimation' },
          ],
        },
        {
          text: 'Shaders — Fragment',
          collapsed: true,
          items: [
            { text: 'DissolveShader', link: '/threejs/shaders/fragment/DissolveShader' },
            { text: 'InteriorMapping', link: '/threejs/shaders/fragment/InteriorMapping' },
            { text: 'RoundedCorners', link: '/threejs/shaders/fragment/RoundedCorners' },
            { text: 'TriplanarMapping', link: '/threejs/shaders/fragment/TriplanarMapping' },
          ],
        },
        {
          text: 'Utils',
          collapsed: true,
          items: [
            { text: 'BaseWorld', link: '/threejs/utils/BaseWorld' },
            { text: 'CharacterPool', link: '/threejs/utils/CharacterPool' },
            { text: 'DayNightCycle', link: '/threejs/utils/DayNightCycle' },
            { text: 'GlobalUniforms', link: '/threejs/utils/GlobalUniforms' },
            { text: 'LODSystem', link: '/threejs/utils/LODSystem' },
            { text: 'RuntimeGuard', link: '/threejs/utils/RuntimeGuard' },
          ],
        },
        {
          text: 'Components',
          collapsed: true,
          items: [
            { text: 'LODBillboard', link: '/threejs/components/LODBillboard' },
            { text: 'OutlineShader', link: '/threejs/components/OutlineShader' },
            { text: 'PostProcessing', link: '/threejs/components/PostProcessing' },
          ],
        },
      ],

      '/babylonjs/': [
        {
          text: 'Babylon.js',
          items: [
            { text: 'Roadmap', link: '/babylonjs/' },
            { text: 'Overview', link: '/babylonjs/overview' },
          ],
        },
      ],

      '/factory/': [
        {
          text: 'Factory',
          items: [
            { text: 'Roadmap', link: '/factory/' },
            { text: 'Overview', link: '/factory/overview' },
            { text: 'Sync Log', link: '/factory/sync' },
          ],
        },
        {
          text: 'Tools',
          items: [
            { text: 'Blender Pipeline', link: '/factory/blender/pipeline' },
          ],
        },
      ],
    },

      '/news/': [
        {
          text: 'News',
          items: [
            { text: 'Latest Updates', link: '/news/' },
          ],
        },
      ],

      '/projects/': [
        {
          text: 'Project Bible',
          items: [
            { text: 'Overview', link: '/projects/' },
          ],
        },
        {
          text: 'Template',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/projects/template/' },
            { text: '01 — Concept', link: '/projects/template/01-concept' },
            { text: '02 — World & Map', link: '/projects/template/02-world' },
            { text: '03 — Characters', link: '/projects/template/03-characters' },
            { text: '04 — Art Style', link: '/projects/template/04-art-style' },
            { text: '05 — Tech Stack', link: '/projects/template/05-tech-stack' },
            { text: '06 — Module Mapping', link: '/projects/template/06-modules' },
            { text: '07 — Infrastructure', link: '/projects/template/07-infrastructure' },
            { text: '08 — Build Phases', link: '/projects/template/08-phases' },
          ],
        },
      ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/NgQuan86' },
    ],

    search: { provider: 'local' },

    footer: {
      message: 'Web-3D Ecosystem Docs',
    },
  },
})
