if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let d={};const t=e=>i(e,o),a={module:{uri:o},exports:d,require:t};s[o]=Promise.all(n.map((e=>a[e]||t(e)))).then((e=>(r(...e),d)))}}define(["./workbox-ed4bad37"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/data.997cc2d2.js",revision:null},{url:"assets/index.0cf69203.css",revision:null},{url:"assets/index.9b210e72.js",revision:null},{url:"assets/okkhor_bg.wasm",revision:"98d54f7685c7051f5751603e02f33f26"},{url:"index.html",revision:"693f72303bcad3b7a7c9ed68f7787f85"},{url:"favicon.svg",revision:"0bd59a293455bdae6654de7dda46e196"},{url:"favicon.ico",revision:"52bac0d50da2b40e9a0b9ec92c6b6829"},{url:"robots.txt",revision:"5e0bd1c281a62a380d7a948085bfe2d1"},{url:"apple-touch-icon.png",revision:"b15eb61294e64c9fdb577ed2ede422ce"},{url:"pwa-192x192.png",revision:"78595da132367d3203265853298dbb04"},{url:"pwa-512x512.png",revision:"9ad087c38e77359dec6d4fe24146f36a"},{url:"manifest.webmanifest",revision:"eba4a4d4c64c99a4247866d51a32ac8a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
