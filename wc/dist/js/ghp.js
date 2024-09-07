import { addLink, addScript, articleFromHtml, getGhFile, getMarkdown, markdownToHtml, mode, mount, setConfig, structureContent } from './ghp-lib.js'

const base = mode === 'prod'
  ? import.meta.url.replace(/\/js\/ghp\.js$/, '')
  : import.meta.url.replace(/\/ghp\.js$/, '/wc/dist')

// console.log(`mode=${mode} base=${base}`)
    
if (!window.config) setConfig()

let scripts = Array.from(document.getElementsByTagName('script')).filter(script => script.src).map(script => script.src)
let stylesheets = Array.from(document.getElementsByTagName('link')).filter(link => link.type == 'text/css'&& link.href).map(link => link.href)

let hasGhpJs = scripts.find(src => src.indexOf('ghp.js') > 0) !== undefined
let hasWcJs = scripts.find(src => src === 'http://localhost:5173/main.ts' || src === `${base}/js/index.js`) !== undefined
let hasWcCss = stylesheets.find(href => href === `${base}/css/index.css`) !== undefined
let isMounted = document.querySelector('body > article') !== null

if (!hasWcCss) {
  addLink({rel: 'stylesheet', type: 'text/css', href: `${base}/css/index.css`})
  hasWcCss = true
}

if (!hasWcJs) {
  addScript({type: 'module', src: mode === 'local' ? 'http://localhost:5173/main.ts' : `${base}/js/index.js`})
  hasWcJs = true
}

function docReady(fn) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(fn, 1)
  else document.addEventListener('DOMContentLoaded', fn)
}

docReady(function() {
  if (hasGhpJs && hasWcJs && hasWcCss && !isMounted) mount()
})

export { articleFromHtml, mount, getGhFile, getMarkdown, markdownToHtml, structureContent }