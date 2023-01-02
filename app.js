if ('serviceworker' in navigator) {
    navigator.serviceWorker.register('sw.js');
    console.log('Registered');
}
