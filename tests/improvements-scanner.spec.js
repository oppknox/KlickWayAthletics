const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Website Improvement Scanner', () => {
  let improvements = [];

  test.afterAll(async () => {
    // Generate improvement report
    const reportPath = path.join(process.cwd(), 'improvement-report.md');
    const reportContent = generateReport(improvements);
    fs.writeFileSync(reportPath, reportContent);
    console.log(`\nImprovement report generated: ${reportPath}`);
  });

  test('scan for missing modern features', async ({ page }) => {
    await page.goto('/');

    // Check for PWA capabilities
    const manifest = await page.$('link[rel="manifest"]');
    if (!manifest) {
      improvements.push({
        category: 'Progressive Web App',
        issue: 'No web app manifest found',
        priority: 'Medium',
        solution: 'Add a manifest.json file to enable PWA features like installability and offline support'
      });
    }

    // Check for service worker
    const hasServiceWorker = await page.evaluate(() => 'serviceWorker' in navigator);
    if (hasServiceWorker) {
      const swRegistered = await page.evaluate(async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.length > 0;
      });
      
      if (!swRegistered) {
        improvements.push({
          category: 'Progressive Web App',
          issue: 'No service worker registered',
          priority: 'Medium',
          solution: 'Implement a service worker for offline functionality and better performance'
        });
      }
    }

    // Check for modern image formats
    const images = await page.$$eval('img', imgs => 
      imgs.map(img => ({
        src: img.src,
        format: img.src.split('.').pop().toLowerCase()
      }))
    );

    const oldFormatImages = images.filter(img => 
      ['jpg', 'jpeg', 'png'].includes(img.format)
    );

    if (oldFormatImages.length > 0) {
      improvements.push({
        category: 'Performance',
        issue: `${oldFormatImages.length} images using older formats`,
        priority: 'High',
        solution: 'Convert images to WebP or AVIF format for 25-35% better compression'
      });
    }

    // Check for critical CSS
    const hasInlineStyles = await page.$eval('head', head => {
      const styles = head.querySelectorAll('style');
      return styles.length > 0;
    });

    if (!hasInlineStyles) {
      improvements.push({
        category: 'Performance',
        issue: 'No critical CSS inlined',
        priority: 'High',
        solution: 'Inline critical above-the-fold CSS to improve First Contentful Paint'
      });
    }

    // Check for preconnect/prefetch
    const resourceHints = await page.$$eval('link[rel="preconnect"], link[rel="dns-prefetch"], link[rel="prefetch"], link[rel="preload"]', 
      links => links.length
    );

    if (resourceHints === 0) {
      improvements.push({
        category: 'Performance',
        issue: 'No resource hints found',
        priority: 'Medium',
        solution: 'Add preconnect for third-party domains and preload for critical resources'
      });
    }
  });

  test('scan for UX improvements', async ({ page }) => {
    await page.goto('/');

    // Check for loading indicators
    const forms = await page.$$('form');
    for (const form of forms) {
      const hasLoadingState = await form.$eval('button[type="submit"]', btn => {
        const onclick = btn.getAttribute('onclick');
        const classes = btn.className;
        return classes.includes('loading') || (onclick && onclick.includes('loading'));
      }).catch(() => false);

      if (!hasLoadingState) {
        improvements.push({
          category: 'User Experience',
          issue: 'Forms lack loading state feedback',
          priority: 'Medium',
          solution: 'Add loading indicators to form submissions for better user feedback'
        });
        break;
      }
    }

    // Check for skeleton screens
    const hasSkeletons = await page.$('.skeleton, .placeholder, [data-skeleton]');
    if (!hasSkeletons) {
      improvements.push({
        category: 'User Experience',
        issue: 'No skeleton screens for loading states',
        priority: 'Low',
        solution: 'Implement skeleton screens for better perceived performance'
      });
    }

    // Check for error boundaries
    const hasErrorHandling = await page.evaluate(() => {
      return window.addEventListener.toString().includes('error') || 
             window.onerror !== null;
    });

    if (!hasErrorHandling) {
      improvements.push({
        category: 'User Experience',
        issue: 'No global error handling detected',
        priority: 'High',
        solution: 'Implement error boundaries and user-friendly error messages'
      });
    }

    // Check for smooth scroll behavior
    const scrollBehavior = await page.$eval('html', html => 
      getComputedStyle(html).scrollBehavior
    );

    if (scrollBehavior !== 'smooth') {
      improvements.push({
        category: 'User Experience',
        issue: 'Smooth scrolling not enabled',
        priority: 'Low',
        solution: 'Add scroll-behavior: smooth to HTML element for better UX'
      });
    }
  });

  test('scan for accessibility improvements', async ({ page }) => {
    await page.goto('/');

    // Check for skip navigation link
    const skipNav = await page.$('a[href="#main"], a[href="#content"], .skip-nav');
    if (!skipNav) {
      improvements.push({
        category: 'Accessibility',
        issue: 'No skip navigation link',
        priority: 'High',
        solution: 'Add a skip to main content link for keyboard navigation'
      });
    }

    // Check for focus visible styles
    const hasFocusStyles = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules || []).some(rule => 
            rule.selectorText && rule.selectorText.includes(':focus')
          );
        } catch {
          return false;
        }
      });
      return styles;
    });

    if (!hasFocusStyles) {
      improvements.push({
        category: 'Accessibility',
        issue: 'Missing focus styles',
        priority: 'High',
        solution: 'Add visible focus indicators for keyboard navigation'
      });
    }

    // Check for reduced motion support
    const hasReducedMotion = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules || []).some(rule => 
            rule.cssText && rule.cssText.includes('prefers-reduced-motion')
          );
        } catch {
          return false;
        }
      });
      return styles;
    });

    if (!hasReducedMotion) {
      improvements.push({
        category: 'Accessibility',
        issue: 'No reduced motion support',
        priority: 'Medium',
        solution: 'Add prefers-reduced-motion media query for users with motion sensitivity'
      });
    }

    // Check for landmark regions
    const landmarks = await page.$$('main, nav, header, footer, aside, section[aria-label], section[aria-labelledby]');
    if (landmarks.length < 3) {
      improvements.push({
        category: 'Accessibility',
        issue: 'Insufficient landmark regions',
        priority: 'Medium',
        solution: 'Use semantic HTML5 elements and ARIA landmarks for better screen reader navigation'
      });
    }
  });

  test('scan for SEO improvements', async ({ page }) => {
    await page.goto('/');

    // Check for canonical URL
    const canonical = await page.$('link[rel="canonical"]');
    if (!canonical) {
      improvements.push({
        category: 'SEO',
        issue: 'No canonical URL specified',
        priority: 'Medium',
        solution: 'Add canonical URLs to prevent duplicate content issues'
      });
    }

    // Check for robots.txt
    const robotsResponse = await page.request.get('/robots.txt').catch(() => null);
    if (!robotsResponse || robotsResponse.status() === 404) {
      improvements.push({
        category: 'SEO',
        issue: 'No robots.txt file',
        priority: 'Medium',
        solution: 'Add robots.txt to control search engine crawling'
      });
    }

    // Check for sitemap
    const sitemapResponse = await page.request.get('/sitemap.xml').catch(() => null);
    if (!sitemapResponse || sitemapResponse.status() === 404) {
      improvements.push({
        category: 'SEO',
        issue: 'No XML sitemap',
        priority: 'Medium',
        solution: 'Generate an XML sitemap for better search engine indexing'
      });
    }

    // Check for Twitter cards
    const twitterCards = await page.$$('meta[name^="twitter:"], meta[property^="twitter:"]');
    if (twitterCards.length === 0) {
      improvements.push({
        category: 'SEO',
        issue: 'No Twitter Card meta tags',
        priority: 'Low',
        solution: 'Add Twitter Card meta tags for better social media sharing'
      });
    }

    // Check internal linking
    const internalLinks = await page.$$eval('a[href^="/"], a[href^="./"], a[href^="../"]', 
      links => links.length
    );

    if (internalLinks < 10) {
      improvements.push({
        category: 'SEO',
        issue: 'Limited internal linking',
        priority: 'Medium',
        solution: 'Improve internal linking structure for better SEO and navigation'
      });
    }
  });

  test('scan for security improvements', async ({ page }) => {
    const response = await page.goto('/');

    // Check security headers
    const headers = response.headers();
    
    const securityHeaders = [
      { name: 'content-security-policy', priority: 'High' },
      { name: 'x-frame-options', priority: 'High' },
      { name: 'x-content-type-options', priority: 'Medium' },
      { name: 'referrer-policy', priority: 'Low' },
      { name: 'permissions-policy', priority: 'Low' }
    ];

    securityHeaders.forEach(header => {
      if (!headers[header.name]) {
        improvements.push({
          category: 'Security',
          issue: `Missing ${header.name} header`,
          priority: header.priority,
          solution: `Add ${header.name} header to improve security`
        });
      }
    });

    // Check for form security
    const forms = await page.$$('form');
    for (const form of forms) {
      const hasCsrf = await form.$('[name="csrf_token"], [name="_token"], [name="authenticity_token"]');
      if (!hasCsrf) {
        improvements.push({
          category: 'Security',
          issue: 'Forms lack CSRF protection',
          priority: 'High',
          solution: 'Implement CSRF tokens for form submissions'
        });
        break;
      }
    }

    // Check for exposed sensitive information
    const scripts = await page.$$eval('script', scripts => 
      scripts.map(s => s.textContent).join('\n')
    );

    const sensitivePatterns = [
      /api[_-]?key/i,
      /secret/i,
      /password/i,
      /token/i
    ];

    sensitivePatterns.forEach(pattern => {
      if (pattern.test(scripts)) {
        improvements.push({
          category: 'Security',
          issue: 'Potential sensitive information in client-side code',
          priority: 'Critical',
          solution: 'Move sensitive data to environment variables and server-side code'
        });
      }
    });
  });

  function generateReport(improvements) {
    const grouped = improvements.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    let report = '# KlickWay Athletics Website Improvement Report\n\n';
    report += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    report += `Total Improvements Identified: ${improvements.length}\n\n`;

    // Priority summary
    const priorities = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    improvements.forEach(i => priorities[i.priority]++);
    
    report += '## Priority Summary\n';
    Object.entries(priorities).forEach(([priority, count]) => {
      if (count > 0) {
        report += `- **${priority}**: ${count} issues\n`;
      }
    });
    report += '\n';

    // Detailed improvements by category
    Object.entries(grouped).forEach(([category, items]) => {
      report += `## ${category}\n\n`;
      items.sort((a, b) => {
        const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      
      items.forEach(item => {
        report += `### ${item.issue}\n`;
        report += `- **Priority**: ${item.priority}\n`;
        report += `- **Solution**: ${item.solution}\n\n`;
      });
    });

    // Implementation roadmap
    report += '## Implementation Roadmap\n\n';
    report += '### Phase 1: Critical & High Priority (Week 1-2)\n';
    improvements.filter(i => i.priority === 'Critical' || i.priority === 'High')
      .forEach(i => report += `- [ ] ${i.issue}\n`);
    
    report += '\n### Phase 2: Medium Priority (Week 3-4)\n';
    improvements.filter(i => i.priority === 'Medium')
      .forEach(i => report += `- [ ] ${i.issue}\n`);
    
    report += '\n### Phase 3: Low Priority (Week 5+)\n';
    improvements.filter(i => i.priority === 'Low')
      .forEach(i => report += `- [ ] ${i.issue}\n`);

    return report;
  }
});