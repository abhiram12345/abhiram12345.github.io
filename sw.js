const cacheName = 'shelfopwa-v1';
const appShellFiles = [
    '/index.html',
    '/js/my-script.js',
    '/js/components.js',
    '/css/mystyle.css'
];
self.addEventListener('install', (e) =>{
	e.waitUntil((
	    async () =>{
		     const cache = await caches.open(cacheName);
		     await cache.addAll(appShellFiles); 
		}
    )());
});
