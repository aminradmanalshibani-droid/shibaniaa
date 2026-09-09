// Phase 31.2 PWA recovery worker: remove stale offline controller
self.addEventListener('install',event=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.registration.unregister().then(()=>self.clients.matchAll({type:'window'})).then(cs=>Promise.all(cs.map(c=>c.navigate(c.url))))));
self.addEventListener('fetch',event=>event.respondWith(fetch(event.request)));
