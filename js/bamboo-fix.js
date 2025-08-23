/**
 * BambooHR Widget Style Fix
 * Ensures job listings are visible on the careers page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Function to fix BambooHR widget styles
    function fixBambooHRStyles() {
        const bambooWidget = document.getElementById('BambooHR');
        
        if (bambooWidget) {
            // Try to access the widget's content
            const widgetContent = bambooWidget.querySelectorAll('*');
            
            widgetContent.forEach(element => {
                // Force text color to be dark
                element.style.setProperty('color', '#333333', 'important');
                
                // Ensure backgrounds don't hide text
                if (element.tagName === 'DIV' || element.tagName === 'SPAN' || element.tagName === 'P') {
                    const bgColor = window.getComputedStyle(element).backgroundColor;
                    if (bgColor === 'rgb(255, 255, 255)' || bgColor === 'white') {
                        element.style.setProperty('color', '#333333', 'important');
                    }
                }
            });
            
            // Check if BambooHR uses an iframe
            const iframe = bambooWidget.querySelector('iframe');
            if (iframe) {
                try {
                    // Attempt to style iframe content (may be blocked by CORS)
                    iframe.onload = function() {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        const style = iframeDoc.createElement('style');
                        style.textContent = `
                            * { color: #333 !important; }
                            a { color: #224de3 !important; }
                            a:hover { color: #1a3ab8 !important; }
                            body { background-color: white !important; }
                        `;
                        iframeDoc.head.appendChild(style);
                    };
                } catch (e) {
                    console.log('Cannot access iframe content due to CORS policy');
                }
            }
        }
    }
    
    // Run the fix immediately
    fixBambooHRStyles();
    
    // Run again after a delay to catch dynamically loaded content
    setTimeout(fixBambooHRStyles, 1000);
    setTimeout(fixBambooHRStyles, 3000);
    
    // Watch for changes in the BambooHR widget
    const observer = new MutationObserver(function(mutations) {
        fixBambooHRStyles();
    });
    
    const bambooContainer = document.getElementById('BambooHR');
    if (bambooContainer) {
        observer.observe(bambooContainer, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }
    
    // Also apply styles using a global style injection
    const globalStyle = document.createElement('style');
    globalStyle.textContent = `
        #BambooHR * {
            color: #333 !important;
        }
        
        #BambooHR {
            background-color: white !important;
            color: #333 !important;
        }
        
        #BambooHR a {
            color: #224de3 !important;
        }
        
        #BambooHR a:hover {
            color: #1a3ab8 !important;
            text-decoration: underline !important;
        }
        
        /* Target common BambooHR class patterns */
        [class*="bamboo"] *,
        [class*="Bamboo"] *,
        [class*="job"] *,
        [class*="Job"] * {
            color: #333 !important;
        }
        
        /* Ensure visibility even with unknown classes */
        .bamboohr-widget div,
        .bamboohr-widget span,
        .bamboohr-widget p,
        .bamboohr-widget li,
        .bamboohr-widget h1,
        .bamboohr-widget h2,
        .bamboohr-widget h3,
        .bamboohr-widget h4 {
            color: #333 !important;
        }
    `;
    document.head.appendChild(globalStyle);
});