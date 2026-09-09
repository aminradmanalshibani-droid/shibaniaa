const CACHE_NAME='shibaniaa-pwa-v32';
const CORE=['./index.html','./manifest.webmanifest'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('shibaniaa-pwa-')&&k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const request=event.request;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));
      return response;
    }).catch(async()=> (await caches.match('./index.html')) || Response.error()));
    return;
  }
  event.respondWith(fetch(request).then(response=>{
    if(response&&response.ok&&new URL(request.url).origin===self.location.origin){
      const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
    }
    return response;
  }).catch(()=>caches.match(request)));
});