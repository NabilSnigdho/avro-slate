if(!self.define){let e,i={};const s=(s,a)=>(s=new URL(s+".js",a).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(a,n)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let o={};const d=e=>s(e,r),t={module:{uri:r},exports:o,require:d};i[r]=Promise.all(a.map((e=>t[e]||d(e)))).then((e=>(n(...e),o)))}}define(["./workbox-4ee7f24a"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/Editor.87ae625e.js",revision:null},{url:"assets/index.119d4a38.js",revision:null},{url:"assets/index.2e41a24b.css",revision:null},{url:"assets/okkhor_bg.wasm",revision:"16f838dcc69beb6a745cba787f2d83f3"},{url:"data/autocorrect.json",revision:"5397f813799c560eede655dabc489b68"},{url:"data/dictionary.json",revision:"0f9ac0ca327a927b9dc23ef27e80a112"},{url:"data/emoticons.json",revision:"2311f23bbd8fb2f900bd9d65085f6d80"},{url:"data/suffixes.json",revision:"52f5c4c5ad7a3593aed423f5aa88e2ae"},{url:"index.html",revision:"362e93ed4ef847a764a8406de7540e6b"},{url:"favicon.svg",revision:"0bd59a293455bdae6654de7dda46e196"},{url:"favicon.ico",revision:"52bac0d50da2b40e9a0b9ec92c6b6829"},{url:"robots.txt",revision:"5e0bd1c281a62a380d7a948085bfe2d1"},{url:"apple-touch-icon.png",revision:"b15eb61294e64c9fdb577ed2ede422ce"},{url:"pwa-192x192.png",revision:"78595da132367d3203265853298dbb04"},{url:"pwa-512x512.png",revision:"9ad087c38e77359dec6d4fe24146f36a"},{url:"manifest.webmanifest",revision:"eba4a4d4c64c99a4247866d51a32ac8a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
