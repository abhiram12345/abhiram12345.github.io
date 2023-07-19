const cacheName = 'shelfopwa-v1';
const appShellFiles = [
    '/index.html',
    '/js/ascript.js',
    '/js/components.js',
    'css/main.css'
];
self.addEventListener('install', (e) =>{
	e.waitUntil((
	    async () =>{
		     const cache = await caches.open(cacheName);
		     await cache.addAll(appShellFiles); 
		}
    )());
});
self.addEventListener('fetch', (e) =>{
	e.respondWith(
        (async () =>{
             const r = await caches.match(e.request);
             if (r) {
             	return r;
             }
             const response = await fetch(e.request );
             const cache = await caches.open(cacheName);
             cache.put(e.request, response.clone());
             return response;
         })()
     );
});
