// 🌟 Cosmic Insights - Service Worker for PWA

const CACHE_NAME = 'cosmic-insights-v1.0.0';
const STATIC_CACHE_NAME = 'cosmic-insights-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'cosmic-insights-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/advanced-styles.css',
    '/enhanced-features.js',
    '/manifest.json',
    // Add other critical assets
];

// API endpoints to cache
const API_ENDPOINTS = [
    '/api/health',
    '/api/groq',
    '/api/readings'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('🌟 SW: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('💾 SW: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ SW: Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ SW: Error caching static assets:', error);
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    console.log('🎆 SW: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName.startsWith('cosmic-insights-') &&
                                   cacheName !== STATIC_CACHE_NAME &&
                                   cacheName !== DYNAMIC_CACHE_NAME;
                        })
                        .map(cacheName => {
                            console.log('🗑️ SW: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('✅ SW: Old caches cleaned');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle API requests
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(handleAPIRequest(request));
        return;
    }
    
    // Handle static assets
    if (isStaticAsset(request.url)) {
        event.respondWith(handleStaticAsset(request));
        return;
    }
    
    // Handle navigation requests
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigationRequest(request));
        return;
    }
    
    // Default: network first, then cache
    event.respondWith(
        fetch(request)
            .then(response => {
                // Cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE_NAME)
                        .then(cache => {
                            cache.put(request, responseClone);
                        });
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache
                return caches.match(request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        // Return a generic offline response
                        return new Response('Offline - Content not available', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: {
                                'Content-Type': 'text/plain'
                            }
                        });
                    });
            })
    );
});

// Handle API requests with cache-first strategy for readings
async function handleAPIRequest(request) {
    const url = new URL(request.url);
    
    try {
        // For reading history, try cache first
        if (url.pathname.includes('/readings')) {
            const cacheResponse = await caches.match(request);
            if (cacheResponse) {
                // Update cache in background
                fetch(request)
                    .then(response => {
                        if (response.status === 200) {
                            caches.open(DYNAMIC_CACHE_NAME)
                                .then(cache => cache.put(request, response.clone()));
                        }
                    })
                    .catch(() => {}); // Ignore background update errors
                
                return cacheResponse;
            }
        }
        
        // Network first for other API calls
        const networkResponse = await fetch(request);
        
        if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, responseClone);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('📏 SW: API request failed, trying cache:', url.pathname);
        
        // Try to return cached response
        const cacheResponse = await caches.match(request);
        if (cacheResponse) {
            return cacheResponse;
        }
        
        // Return offline API response
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'This request requires an internet connection',
                offline: true,
                timestamp: new Date().toISOString()
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
    try {
        // Try cache first
        const cacheResponse = await caches.match(request);
        if (cacheResponse) {
            return cacheResponse;
        }
        
        // Fallback to network
        const networkResponse = await fetch(request);
        
        if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            const cache = await caches.open(STATIC_CACHE_NAME);
            cache.put(request, responseClone);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('🖼️ SW: Static asset failed:', request.url);
        
        // Return cached version or placeholder
        const cacheResponse = await caches.match(request);
        if (cacheResponse) {
            return cacheResponse;
        }
        
        // Return placeholder response
        return new Response('Resource not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
    try {
        // Try network first for navigation
        const networkResponse = await fetch(request);
        return networkResponse;
        
    } catch (error) {
        // Fallback to cached index.html
        const cacheResponse = await caches.match('/index.html');
        if (cacheResponse) {
            return cacheResponse;
        }
        
        // Ultimate fallback
        return new Response(
            `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Cosmic Insights - Offline</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 50px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        min-height: 100vh;
                        margin: 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .offline-icon { font-size: 64px; margin-bottom: 20px; }
                    h1 { margin-bottom: 20px; }
                    p { margin-bottom: 30px; line-height: 1.6; }
                    .retry-btn {
                        background: rgba(255, 255, 255, 0.2);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        color: white;
                        padding: 12px 24px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    }
                    .retry-btn:hover {
                        background: rgba(255, 255, 255, 0.3);
                        transform: translateY(-2px);
                    }
                </style>
            </head>
            <body>
                <div class="offline-icon">🌌</div>
                <h1>You're Offline</h1>
                <p>Cosmic Insights is currently unavailable.<br>
                Please check your internet connection and try again.</p>
                <button class="retry-btn" onclick="window.location.reload()">
                    🔄 Try Again
                </button>
            </body>
            </html>
            `,
            {
                status: 200,
                headers: {
                    'Content-Type': 'text/html'
                }
            }
        );
    }
}

// Utility function to check if URL is a static asset
function isStaticAsset(url) {
    return url.includes('.css') || 
           url.includes('.js') || 
           url.includes('.png') || 
           url.includes('.jpg') || 
           url.includes('.jpeg') || 
           url.includes('.gif') || 
           url.includes('.svg') || 
           url.includes('.ico') || 
           url.includes('.woff') || 
           url.includes('.woff2') || 
           url.includes('.ttf');
}

// Background sync for offline form submissions
self.addEventListener('sync', event => {
    console.log('🔄 SW: Background sync triggered:', event.tag);
    
    if (event.tag === 'cosmic-reading-sync') {
        event.waitUntil(syncOfflineReadings());
    }
});

// Sync offline readings when connection is restored
async function syncOfflineReadings() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const offlineReadings = await getOfflineReadings();
        
        for (const reading of offlineReadings) {
            try {
                await fetch('/api/groq', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reading)
                });
                
                // Remove from offline storage after successful sync
                await removeOfflineReading(reading.id);
                
            } catch (error) {
                console.log('Failed to sync reading:', reading.id);
            }
        }
        
        console.log('✅ SW: Offline readings synced');
        
    } catch (error) {
        console.error('❌ SW: Error syncing offline readings:', error);
    }
}

// Utility functions for offline storage
async function getOfflineReadings() {
    // Implementation would depend on your storage strategy
    // This is a placeholder for IndexedDB or localStorage usage
    return [];
}

async function removeOfflineReading(readingId) {
    // Implementation for removing synced readings
    console.log('Removing synced reading:', readingId);
}

// Push notification handling
self.addEventListener('push', event => {
    if (!event.data) return;
    
    try {
        const data = event.data.json();
        
        const options = {
            body: data.body || 'New cosmic insight available!',
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            vibrate: [200, 100, 200],
            data: data,
            actions: [
                {
                    action: 'open',
                    title: 'Open App',
                    icon: '/icon-open.png'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss',
                    icon: '/icon-dismiss.png'
                }
            ],
            tag: 'cosmic-insight',
            renotify: true
        };
        
        event.waitUntil(
            self.registration.showNotification(
                data.title || '🌟 Cosmic Insights',
                options
            )
        );
        
    } catch (error) {
        console.error('Error handling push notification:', error);
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
    // 'dismiss' action closes notification automatically
});

// Handle message from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

console.log('🌟 Cosmic Insights Service Worker loaded successfully!');