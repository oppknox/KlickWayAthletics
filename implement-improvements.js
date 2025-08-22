const fs = require('fs');
const path = require('path');

console.log('🚀 Implementing Website Improvements...\n');

// 1. Create robots.txt
const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: https://klickwayathletics.com/sitemap.xml
`;

fs.writeFileSync('robots.txt', robotsTxt);
console.log('✅ Created robots.txt');

// 2. Generate sitemap.xml
const pages = [
  'index.html',
  'about.html',
  'contact.html',
  'contest-prep.html',
  'locations.html',
  'locations/everett.html'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>https://klickwayathletics.com/${page === 'index.html' ? '' : page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === 'index.html' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log('✅ Generated sitemap.xml');

// 3. Create manifest.json for PWA
const manifest = {
  "name": "KlickWay Athletics",
  "short_name": "KlickWay",
  "description": "Premium fitness centers in Washington - Personal training, nutrition coaching, and more",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#28a745",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/img/Klickway-Athletics_Secondary-Logo-on-Black.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["fitness", "health", "sports"],
  "lang": "en-US"
};

fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
console.log('✅ Created manifest.json for PWA');

// 4. Create service worker for offline support
const serviceWorker = `const CACHE_NAME = 'klickway-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/css/fonts.css',
  '/css/responsive.css',
  '/js/main.js',
  '/img/Klickway-Athletics_Secondary-Logo-on-Black.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});`;

fs.writeFileSync('sw.js', serviceWorker);
console.log('✅ Created service worker (sw.js)');

// 5. Create meta tags helper
const metaTags = `
<!-- Add these meta tags to your HTML head section -->

<!-- Canonical URL -->
<link rel="canonical" href="https://klickwayathletics.com/">

<!-- Open Graph Tags -->
<meta property="og:title" content="KlickWay Athletics - Premium Fitness Centers">
<meta property="og:description" content="Unlock your potential with personalized fitness solutions in Washington">
<meta property="og:image" content="https://klickwayathletics.com/img/Klickway-Athletics_Secondary-Logo-on-Black.png">
<meta property="og:url" content="https://klickwayathletics.com/">
<meta property="og:type" content="website">

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="KlickWay Athletics - Premium Fitness Centers">
<meta name="twitter:description" content="Unlock your potential with personalized fitness solutions in Washington">
<meta name="twitter:image" content="https://klickwayathletics.com/img/Klickway-Athletics_Secondary-Logo-on-Black.png">

<!-- PWA -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#28a745">

<!-- Preconnect for performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdnjs.cloudflare.com">

<!-- Security Headers (add to server config or .htaccess) -->
<!-- 
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
-->
`;

fs.writeFileSync('meta-tags-to-add.html', metaTags);
console.log('✅ Created meta-tags-to-add.html with SEO improvements');

// 6. Create accessibility improvements CSS
const accessibilityCSS = `
/* Add these styles to your CSS */

/* Skip to main content link */
.skip-nav {
  position: absolute;
  top: -40px;
  left: 0;
  background: #28a745;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100000;
}

.skip-nav:focus {
  top: 0;
}

/* Focus visible styles */
*:focus {
  outline: 2px solid #28a745;
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;

fs.writeFileSync('accessibility-improvements.css', accessibilityCSS);
console.log('✅ Created accessibility-improvements.css');

// 7. Create performance optimization script
const perfScript = `
// Add this to your main.js or create a new performance.js file

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered:', registration))
      .catch(error => console.log('SW registration failed:', error));
  });
}

// Lazy load images with native loading attribute
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.loading) {
      img.loading = 'lazy';
    }
  });
});

// Preload critical resources
const preloadLink = document.createElement('link');
preloadLink.rel = 'preload';
preloadLink.as = 'image';
preloadLink.href = '/img/Klickway-Athletics_Secondary-Logo-on-Black.png';
document.head.appendChild(preloadLink);
`;

fs.writeFileSync('performance-optimizations.js', perfScript);
console.log('✅ Created performance-optimizations.js');

console.log('\n🎉 All improvements have been implemented!');
console.log('\n📋 Next steps:');
console.log('1. Add the meta tags from meta-tags-to-add.html to your HTML files');
console.log('2. Include accessibility-improvements.css in your pages');
console.log('3. Add performance-optimizations.js to your pages');
console.log('4. Test the PWA features (manifest.json and service worker)');
console.log('5. Deploy robots.txt and sitemap.xml to your root directory');
console.log('\n💡 Run "npm test" again to verify improvements!');