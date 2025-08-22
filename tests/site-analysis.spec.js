const { test, expect } = require('@playwright/test');

test.describe('KlickWay Athletics Site Analysis', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080'); // Adjust URL as needed
  });

  test.describe('Performance & Core Web Vitals', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('http://localhost:8080');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
      console.log(`Page load time: ${loadTime}ms`);
    });

    test('should have optimized images', async ({ page }) => {
      const images = await page.$$eval('img', imgs => 
        imgs.map(img => ({
          src: img.src,
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.clientWidth,
          displayHeight: img.clientHeight,
          loading: img.loading
        }))
      );

      const oversizedImages = images.filter(img => 
        img.naturalWidth > img.displayWidth * 2 || 
        img.naturalHeight > img.displayHeight * 2
      );

      console.log(`Found ${oversizedImages.length} potentially oversized images`);
      oversizedImages.forEach(img => {
        console.log(`Oversized: ${img.src}`);
      });

      const missingAlt = images.filter(img => !img.alt);
      console.log(`Found ${missingAlt.length} images without alt text`);
    });
  });

  test.describe('Accessibility Checks', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements =>
        elements.map(el => ({
          tag: el.tagName,
          text: el.textContent.trim(),
          level: parseInt(el.tagName.charAt(1))
        }))
      );

      const h1Count = headings.filter(h => h.tag === 'H1').length;
      expect(h1Count).toBe(1); // Should have exactly one H1

      // Check for skipped heading levels
      for (let i = 1; i < headings.length; i++) {
        const levelDiff = headings[i].level - headings[i-1].level;
        if (levelDiff > 1) {
          console.log(`Heading level skip detected: ${headings[i-1].tag} -> ${headings[i].tag}`);
        }
      }
    });

    test('should have proper ARIA labels', async ({ page }) => {
      const buttons = await page.$$eval('button', btns => 
        btns.map(btn => ({
          text: btn.textContent.trim(),
          ariaLabel: btn.getAttribute('aria-label'),
          hasText: btn.textContent.trim().length > 0
        }))
      );

      const unlabeledButtons = buttons.filter(btn => !btn.hasText && !btn.ariaLabel);
      console.log(`Found ${unlabeledButtons.length} buttons without labels`);

      const links = await page.$$eval('a', anchors => 
        anchors.map(a => ({
          href: a.href,
          text: a.textContent.trim(),
          ariaLabel: a.getAttribute('aria-label'),
          hasText: a.textContent.trim().length > 0
        }))
      );

      const unlabeledLinks = links.filter(link => !link.hasText && !link.ariaLabel);
      console.log(`Found ${unlabeledLinks.length} links without labels`);
    });

    test('should have sufficient color contrast', async ({ page }) => {
      // This is a simplified check - for full contrast testing, use axe-core
      const elements = await page.$$eval('*', els => {
        const checkContrast = (fg, bg) => {
          // Simple luminance calculation
          const getLuminance = (color) => {
            const rgb = color.match(/\d+/g);
            if (!rgb) return 0;
            const [r, g, b] = rgb.map(Number);
            return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          };
          
          const l1 = getLuminance(fg);
          const l2 = getLuminance(bg);
          const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          return contrast;
        };

        return els.map(el => {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const bgColor = styles.backgroundColor;
          
          if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
            const contrast = checkContrast(color, bgColor);
            if (contrast < 4.5 && el.textContent.trim()) {
              return {
                element: el.tagName,
                text: el.textContent.substring(0, 50),
                contrast: contrast.toFixed(2)
              };
            }
          }
          return null;
        }).filter(Boolean);
      });

      console.log(`Found ${elements.length} potential contrast issues`);
    });
  });

  test.describe('SEO Optimization', () => {
    test('should have proper meta tags', async ({ page }) => {
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(60);

      const metaDescription = await page.$eval('meta[name="description"]', el => el.content).catch(() => null);
      expect(metaDescription).toBeTruthy();
      expect(metaDescription.length).toBeGreaterThan(50);
      expect(metaDescription.length).toBeLessThan(160);

      const viewport = await page.$eval('meta[name="viewport"]', el => el.content).catch(() => null);
      expect(viewport).toContain('width=device-width');

      const ogTags = await page.$$eval('meta[property^="og:"]', metas => 
        metas.map(meta => ({
          property: meta.getAttribute('property'),
          content: meta.content
        }))
      );
      
      console.log(`Found ${ogTags.length} Open Graph tags`);
      if (ogTags.length === 0) {
        console.log('Missing Open Graph tags for social media sharing');
      }
    });

    test('should have structured data', async ({ page }) => {
      const structuredData = await page.$$eval('script[type="application/ld+json"]', scripts => 
        scripts.map(script => {
          try {
            return JSON.parse(script.textContent);
          } catch {
            return null;
          }
        }).filter(Boolean)
      );

      console.log(`Found ${structuredData.length} structured data blocks`);
      if (structuredData.length === 0) {
        console.log('No structured data found - consider adding schema.org markup');
      }
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should be mobile responsive', async ({ page }) => {
      const viewports = [
        { width: 375, height: 667, name: 'iPhone SE' },
        { width: 768, height: 1024, name: 'iPad' },
        { width: 1920, height: 1080, name: 'Desktop' }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500);

        const horizontalScroll = await page.evaluate(() => 
          document.documentElement.scrollWidth > document.documentElement.clientWidth
        );

        if (horizontalScroll) {
          console.log(`Horizontal scroll detected at ${viewport.name} (${viewport.width}px)`);
        }

        // Check if mobile menu is visible on mobile
        if (viewport.width < 768) {
          const mobileMenuVisible = await page.isVisible('.mobile-menu-toggle');
          expect(mobileMenuVisible).toBe(true);
          
          const desktopNavVisible = await page.isVisible('.desktop-nav');
          expect(desktopNavVisible).toBe(false);
        }
      }
    });
  });

  test.describe('Forms & Interactivity', () => {
    test('should have working form validation', async ({ page }) => {
      const forms = await page.$$('form');
      console.log(`Found ${forms.length} forms`);

      for (const form of forms) {
        const formId = await form.getAttribute('id');
        const requiredInputs = await form.$$('input[required], select[required], textarea[required]');
        
        console.log(`Form ${formId || 'unnamed'} has ${requiredInputs.length} required fields`);

        // Check for proper input types
        const emailInputs = await form.$$('input[type="email"]');
        const telInputs = await form.$$('input[type="tel"]');
        
        if (emailInputs.length === 0) {
          const textInputsWithEmail = await form.$$eval('input[type="text"]', inputs =>
            inputs.filter(input => 
              input.name?.includes('email') || 
              input.placeholder?.toLowerCase().includes('email')
            ).length
          );
          
          if (textInputsWithEmail > 0) {
            console.log('Email fields should use type="email" for better validation');
          }
        }
      }
    });

    test('should have working navigation', async ({ page }) => {
      const links = await page.$$eval('a[href]', anchors => 
        anchors.map(a => ({
          href: a.href,
          text: a.textContent.trim(),
          isExternal: a.href.startsWith('http') && !a.href.includes(window.location.hostname)
        }))
      );

      const brokenLinks = [];
      const externalLinks = links.filter(link => link.isExternal);
      
      console.log(`Found ${externalLinks.length} external links`);

      // Check for broken internal links
      const internalLinks = links.filter(link => !link.isExternal && !link.href.startsWith('#'));
      
      for (const link of internalLinks.slice(0, 10)) { // Check first 10 to avoid too many requests
        const response = await page.request.get(link.href).catch(() => null);
        if (!response || response.status() >= 400) {
          brokenLinks.push(link);
        }
      }

      if (brokenLinks.length > 0) {
        console.log(`Found ${brokenLinks.length} potentially broken links`);
        brokenLinks.forEach(link => console.log(`Broken: ${link.href}`));
      }
    });
  });

  test.describe('Security & Best Practices', () => {
    test('should follow security best practices', async ({ page }) => {
      // Check for external links without rel="noopener"
      const unsafeLinks = await page.$$eval('a[target="_blank"]', links =>
        links.filter(link => {
          const rel = link.getAttribute('rel') || '';
          return !rel.includes('noopener') || !rel.includes('noreferrer');
        }).map(link => link.href)
      );

      if (unsafeLinks.length > 0) {
        console.log(`Found ${unsafeLinks.length} external links without rel="noopener noreferrer"`);
      }

      // Check for mixed content
      const resources = await page.$$eval('img, script, link', elements =>
        elements.map(el => el.src || el.href).filter(url => url && url.startsWith('http://'))
      );

      if (resources.length > 0) {
        console.log(`Found ${resources.length} resources loaded over HTTP (should use HTTPS)`);
      }

      // Check for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.reload();
      await page.waitForTimeout(2000);

      if (consoleErrors.length > 0) {
        console.log(`Found ${consoleErrors.length} console errors`);
        consoleErrors.forEach(error => console.log(`Console error: ${error}`));
      }
    });
  });

  test.describe('Performance Opportunities', () => {
    test('should identify optimization opportunities', async ({ page }) => {
      // Check for inline styles
      const inlineStyles = await page.$$eval('[style]', elements => elements.length);
      if (inlineStyles > 10) {
        console.log(`Found ${inlineStyles} elements with inline styles - consider moving to CSS`);
      }

      // Check for large JavaScript bundles
      const scripts = await page.$$eval('script[src]', scripts =>
        scripts.map(script => script.src)
      );

      console.log(`Loading ${scripts.length} external scripts`);

      // Check for missing lazy loading
      const images = await page.$$eval('img', imgs =>
        imgs.filter(img => !img.loading && !img.dataset.src).length
      );

      if (images > 5) {
        console.log(`${images} images could benefit from lazy loading`);
      }

      // Check for web font optimization
      const fonts = await page.$$eval('link[rel="stylesheet"]', links =>
        links.filter(link => link.href.includes('font')).length
      );

      if (fonts > 0) {
        console.log('Consider using font-display: swap for better perceived performance');
      }
    });
  });
});

test.describe('Generate Improvement Report', () => {
  test('compile findings and recommendations', async ({ page }) => {
    console.log('\n=== WEBSITE ANALYSIS COMPLETE ===\n');
    console.log('Key Areas for Improvement:');
    console.log('1. Performance: Implement lazy loading, optimize images, minify assets');
    console.log('2. SEO: Add Open Graph tags, structured data, optimize meta descriptions');
    console.log('3. Accessibility: Fix heading hierarchy, add missing alt texts, improve contrast');
    console.log('4. Security: Add rel="noopener noreferrer" to external links');
    console.log('5. Mobile: Test and fix any responsive issues');
    console.log('6. Forms: Enhance validation and user feedback');
  });
});