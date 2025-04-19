/**
 * KlickWay Athletics - Form Validation
 * This file contains the form validation and submission functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    initFormValidation();
});

/**
 * Initialize Form Validation
 */
function initFormValidation() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            
            // Validate form fields
            let isValid = true;
            
            // First Name validation
            if (!validateField(firstName, isNotEmpty)) {
                showError(firstName, 'First name is required');
                isValid = false;
            } else {
                removeError(firstName);
            }
            
            // Last Name validation
            if (!validateField(lastName, isNotEmpty)) {
                showError(lastName, 'Last name is required');
                isValid = false;
            } else {
                removeError(lastName);
            }
            
            // Phone validation
            if (!validateField(phone, isValidPhone)) {
                showError(phone, 'Please enter a valid phone number');
                isValid = false;
            } else {
                removeError(phone);
            }
            
            // Email validation
            if (!validateField(email, isValidEmail)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            } else {
                removeError(email);
            }
            
            // If form is valid, submit it
            if (isValid) {
                // In a real implementation, you would send the form data to a server
                // For this example, we'll simulate a successful submission
                simulateFormSubmission(newsletterForm);
            }
        });
    }
}

/**
 * Validate a field with a validation function
 * @param {HTMLElement} field - The field to validate
 * @param {Function} validationFn - The validation function to use
 * @returns {Boolean} - Whether the field is valid
 */
function validateField(field, validationFn) {
    return validationFn(field.value);
}

/**
 * Check if a value is not empty
 * @param {String} value - The value to check
 * @returns {Boolean} - Whether the value is not empty
 */
function isNotEmpty(value) {
    return value.trim() !== '';
}

/**
 * Check if a value is a valid email
 * @param {String} value - The value to check
 * @returns {Boolean} - Whether the value is a valid email
 */
function isValidEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

/**
 * Check if a value is a valid phone number
 * @param {String} value - The value to check
 * @returns {Boolean} - Whether the value is a valid phone number
 */
function isValidPhone(value) {
    // Allow formats like (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
    const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(value);
}

/**
 * Show an error message for a field
 * @param {HTMLElement} field - The field to show the error for
 * @param {String} message - The error message to show
 */
function showError(field, message) {
    // Remove any existing error
    removeError(field);
    
    // Add error class to field
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Insert error message after field
    field.parentNode.appendChild(errorElement);
}

/**
 * Remove an error message for a field
 * @param {HTMLElement} field - The field to remove the error for
 */
function removeError(field) {
    // Remove error class from field
    field.classList.remove('error');
    
    // Remove error message element if it exists
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Simulate a form submission
 * @param {HTMLFormElement} form - The form to simulate submission for
 */
function simulateFormSubmission(form) {
    // Disable form
    const formElements = form.elements;
    for (let i = 0; i < formElements.length; i++) {
        formElements[i].disabled = true;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    
    // Simulate server request
    setTimeout(function() {
        // Show success message
        form.innerHTML = `
            <div class="success-message">
                <h3>Thank You!</h3>
                <p>You have been successfully subscribed to our newsletter.</p>
                <p>We'll keep you updated with the latest news and offers.</p>
            </div>
        `;
    }, 1500);
}

/**
 * Enhancement: Real-time form validation
 */
function initRealTimeValidation() {
    const formInputs = document.querySelectorAll('#newsletter-form input');
    
    if (formInputs.length > 0) {
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                // Validate field based on its type
                switch(this.id) {
                    case 'firstName':
                    case 'lastName':
                        if (!validateField(this, isNotEmpty)) {
                            showError(this, `${this.placeholder.replace('*', '')} is required`);
                        } else {
                            removeError(this);
                        }
                        break;
                    case 'phone':
                        if (!validateField(this, isValidPhone)) {
                            showError(this, 'Please enter a valid phone number');
                        } else {
                            removeError(this);
                        }
                        break;
                    case 'email':
                        if (!validateField(this, isValidEmail)) {
                            showError(this, 'Please enter a valid email address');
                        } else {
                            removeError(this);
                        }
                        break;
                }
            });
        });
    }
}

// Initialize real-time validation
document.addEventListener('DOMContentLoaded', initRealTimeValidation);

/**
 * Enhancement: Form auto-save to localStorage
 */
function initFormAutoSave() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        // Load saved form data if it exists
        const savedFormData = localStorage.getItem('newsletterFormData');
        if (savedFormData) {
            const formData = JSON.parse(savedFormData);
            
            // Populate form fields with saved data
            for (const key in formData) {
                const field = document.getElementById(key);
                if (field) {
                    field.value = formData[key];
                }
            }
        }
        
        // Save form data on input change
        const formInputs = newsletterForm.querySelectorAll('input');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                const formData = {};
                
                // Collect current form data
                formInputs.forEach(input => {
                    formData[input.id] = input.value;
                });
                
                // Save to localStorage
                localStorage.setItem('newsletterFormData', JSON.stringify(formData));
            });
        });
        
        // Clear saved form data on successful submission
        newsletterForm.addEventListener('submit', function(e) {
            if (this.checkValidity()) {
                localStorage.removeItem('newsletterFormData');
            }
        });
    }
}

// Initialize form auto-save
document.addEventListener('DOMContentLoaded', initFormAutoSave);
