// configuration
`use strict`;

const
  version = '1.0.0',
  CACHE = version + '::RealKampBox-PWAsite',
  offlineURL = '/offline/',
  installFilesEssential = [
    '/',
    '/views/Homepage.ejs',
    '/views/offline.ejs',
    '/manifest.json',
    '/css/bootstrap/bootstrap.min.css',
    '/css/font-awesome/css/font-awesome.min.css',
    '/css/loading_io/loading-btn.css',
    '/css/loading_io/loading.css',
    '/css/style.css',
    '/js/bundle.js',
    '/js/vue.js',
    '/js/offlinepage.js',
    '/images/innovestors.png'
  ].concat(offlineURL),
  installFilesDesirable = [
    '/logo016.png',
    '/logo072.png'
  ];

// install static assets
function installStaticFiles() {

  return caches.open(CACHE)
    .then(cache => {

      // cache desirable files
      cache.addAll(installFilesDesirable);

      // cache essential files
      return cache.addAll(installFilesEssential);

    });

}

// clear old caches
function clearOldCaches() {

  return caches.keys()
    .then(keylist => {

      return Promise.all(
        keylist
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      );

    });

}

// application installation
self.addEventListener('install', event => {

  console.log('service worker: install');

  // cache core files
  event.waitUntil(
    installStaticFiles()
    .then(() => self.skipWaiting())
  );

});


// application activated
self.addEventListener('activate', event => {

  console.log('service worker: activate');

	// delete old caches
  event.waitUntil(
    clearOldCaches()
    .then(() => self.clients.claim())
	);

});


// is image URL?
let iExt = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].map(f => '.' + f);
function isImage(url) {

  return iExt.reduce((ret, ext) => ret || url.endsWith(ext), false);

}


// return offline asset
function offlineAsset(url) {

  if (isImage(url)) {

    // return image
    return new Response(
      '<svg role="img" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title>offline</title><path d="M0 0h400v300H0z" fill="#eee" /><text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="50" fill="#ccc">offline</text></svg>',
      { headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store'
      }}
    );

  }
  else {

    // return page
    return caches.match(offlineURL);

  }

}


// application fetch network data
self.addEventListener('fetch', event => {
  console.log('my own cache');
  // abandon non-GET requests
  if (event.request.method !== 'GET') return;

  let url = event.request.url;

  event.respondWith(

    caches.open(CACHE)
      .then(cache => {

        return cache.match(event.request)
          .then(response => {

            if (response) {
              // return cached file
              console.log('cache fetch: ' + url);
              return response;
            }

            // make network request
            return fetch(event.request)
              .then(newreq => {

                console.log('network fetch: ' + url);
                if (newreq.ok) cache.put(event.request, newreq.clone());
                return newreq;

              })
              // app is offline
              .catch(() => offlineAsset(url));

          });

      })

  );

});