/**
 * FAQ Accordion Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all other FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current FAQ
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Smooth scroll to FAQ if opening
            if (!isExpanded) {
                setTimeout(() => {
                    const rect = this.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const targetY = rect.top + scrollTop - 100; // 100px offset for header
                    
                    if (rect.top < 0) {
                        window.scrollTo({
                            top: targetY,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        });
    });
    
    // Open first FAQ by default (gym hours)
    const firstFaq = document.querySelector('.faq-question');
    if (firstFaq) {
        firstFaq.setAttribute('aria-expanded', 'true');
    }
    
    // Handle deep linking to specific FAQ
    function openFaqFromHash() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#faq-')) {
            const faqIndex = parseInt(hash.replace('#faq-', '')) - 1;
            const targetFaq = faqQuestions[faqIndex];
            
            if (targetFaq) {
                // Close all FAQs
                faqQuestions.forEach(question => {
                    question.setAttribute('aria-expanded', 'false');
                });
                
                // Open target FAQ
                targetFaq.setAttribute('aria-expanded', 'true');
                
                // Scroll to it
                setTimeout(() => {
                    targetFaq.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            }
        }
    }
    
    // Check for FAQ hash on load
    openFaqFromHash();
    
    // Listen for hash changes
    window.addEventListener('hashchange', openFaqFromHash);
    
    // Add keyboard navigation
    faqQuestions.forEach(question => {
        question.addEventListener('keydown', function(e) {
            // Enter or Space key
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});