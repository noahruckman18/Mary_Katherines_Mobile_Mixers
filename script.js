document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    // Sticky Header
    const header = document.getElementById('header');
    // Smooth Scroll Links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .hero-section a[href^="#"], .cta-button[href^="#"]');
    // Contact Form Elements
    const form = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');
    const submitButton = document.getElementById('submit-button');
    // Footer Year
    const currentYearSpan = document.getElementById('currentYear');
    // Loader Elements
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    // FAQ Elements
    const faqItems = document.querySelectorAll('.faq-item');

    // Mobile Menu Logic
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) { // Ensure icon exists
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-3-line');
                } else {
                    icon.classList.remove('ri-menu-3-line');
                    icon.classList.add('ri-close-line');
                }
            }
        });
    }

    // Smooth Scroll Logic
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    let headerOffset = 0;
                    if (header && getComputedStyle(header).position === 'sticky'){
                        headerOffset = header.offsetHeight;
                    }
                    
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    // Close mobile menu if open and a link is clicked
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                        const icon = mobileMenuButton.querySelector('i');
                        if (icon) { 
                            icon.classList.remove('ri-close-line');
                            icon.classList.add('ri-menu-3-line');
                        }
                    }
                }
            }
        });
    });
    
    // Sticky Header Logic
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Contact Form Submission Logic
    if (form && formResult && submitButton) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            formResult.innerHTML = ""; 
            formResult.className = "mb-4 text-sm text-center"; 
            
            let isValid = true;
            // Check all required fields
            form.querySelectorAll('[required]').forEach(input => {
                // Check if the input is visible (not part of a hidden section)
                if (input.offsetParent !== null) { 
                    if (input.type === 'radio' || input.type === 'checkbox') {
                        const groupName = input.name;
                        if (!form.querySelector(`input[name="${groupName}"]:checked`)) {
                            isValid = false;
                        }
                    } else if (!input.value.trim()) {
                       isValid = false;
                    }
                }
            });

            // Specifically check the "Services Interested In" checkboxes as a group
            const servicesCheckboxes = form.querySelectorAll('input[name="services_interested[]"]');
            const checkedServices = Array.from(servicesCheckboxes).filter(cb => cb.checked);
            if (checkedServices.length === 0) {
                 isValid = false;
                 // This console log is for debugging and can be removed in production
                 console.log("Validation: No services selected.");
            }

            if (!isValid) {
                formResult.innerHTML = "Please fill out all required fields (*).";
                formResult.classList.add('text-red-600', 'font-semibold');
                // Try to focus the first invalid, visible field
                const firstInvalid = form.querySelector('[required]:invalid, [required]:placeholder-shown:not([type=hidden])'); 
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const formData = new FormData(form);
            const object = Object.fromEntries(formData.entries());
            // Ensure checkbox group data is correctly formatted
            object['services_interested'] = formData.getAll('services_interested[]');
            const json = JSON.stringify(object);

            formResult.innerHTML = "Sending your details...";
            formResult.classList.add('text-mk-dark-blue');
            submitButton.disabled = true;
            submitButton.classList.add('opacity-70', 'cursor-not-allowed');

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200 && jsonResponse.success) {
                    formResult.innerHTML = "Form submitted successfully! I'll be in touch soon. Thank you!";
                    formResult.classList.remove('text-mk-dark-blue', 'text-red-600');
                    formResult.classList.add('text-green-600', 'font-semibold');
                    form.reset();
                    // Re-check default radio/checkboxes after reset, as form.reset() clears them
                    if(form.querySelector('#dry_hire_yes')) form.querySelector('#dry_hire_yes').checked = true;
                    if(form.querySelector('#coolers_yes')) form.querySelector('#coolers_yes').checked = true;
                    if(form.querySelector('#service_mobile_bar')) form.querySelector('#service_mobile_bar').checked = true;
                    if(form.querySelector('#service_signature_cocktails')) form.querySelector('#service_signature_cocktails').checked = true;
                    if(form.querySelector('#service_beer_wine')) form.querySelector('#service_beer_wine').checked = true;
                } else {
                    formResult.innerHTML = jsonResponse.message || "An error occurred. Please try again.";
                    formResult.classList.remove('text-mk-dark-blue', 'text-green-600');
                    formResult.classList.add('text-red-600', 'font-semibold');
                }
            })
            .catch(error => {
                console.error("Form submission error:", error);
                formResult.innerHTML = "Something went wrong! Please check your connection or try again later.";
                formResult.classList.remove('text-mk-dark-blue', 'text-green-600');
                formResult.classList.add('text-red-600', 'font-semibold');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
                // Scroll to the result message for better visibility
                formResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    // Update Footer Year
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Loader Logic
    if (loader && mainContent) { 
        setTimeout(() => {
            if(loader) { 
                loader.style.opacity = '0';
            }
            if(mainContent) { 
                mainContent.style.opacity = '1';
            }
            // Ensure loader is hidden after transition
            setTimeout(() => {
                if(loader) loader.style.display = 'none'; 
            }, 500); // Corresponds to opacity transition duration
        }, 3500); // Initial delay before starting fade out
    }

    // FAQ Accordion Logic
    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');
        const icon = questionButton ? questionButton.querySelector('i') : null;

        // Initialize: Ensure answer is closed and has no inline padding that would override CSS
        if (answerDiv) {
            answerDiv.classList.remove('open'); 
            answerDiv.style.maxHeight = null;  
            // Explicitly remove inline padding styles from JS, so CSS classes control it
            answerDiv.style.paddingTop = '';
            answerDiv.style.paddingBottom = '';
        }
        if (icon) icon.classList.remove('rotate-180');

        if (questionButton && answerDiv && icon) {
            questionButton.addEventListener('click', () => {
                const isOpen = answerDiv.classList.contains('open');
                
                // Close all other FAQ items before toggling the current one
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswerDiv = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        if (otherAnswerDiv && otherIcon) { 
                            otherAnswerDiv.classList.remove('open');
                            otherAnswerDiv.style.maxHeight = null;
                            // Ensure their inline paddings are also cleared on close
                            otherAnswerDiv.style.paddingTop = '';
                            otherAnswerDiv.style.paddingBottom = '';
                            otherIcon.classList.remove('rotate-180');
                        }
                    }
                });

                // Toggle current item
                if (isOpen) { // If currently open, close it
                    answerDiv.classList.remove('open'); // Padding from .open class is removed by CSS
                    answerDiv.style.maxHeight = null;   // Animates to 0 (due to .faq-answer CSS)
                    icon.classList.remove('rotate-180');
                } else { // If currently closed, open it
                    answerDiv.classList.add('open');    // Padding from .open class applies instantly (due to CSS)
                    // scrollHeight will now include the padding from .open class
                    answerDiv.style.maxHeight = answerDiv.scrollHeight + "px"; 
                    icon.classList.add('rotate-180');
                }
            });
        }
    });

    // Pre-check some form options on initial load if desired
    if(form) { 
         if(form.querySelector('#dry_hire_yes')) form.querySelector('#dry_hire_yes').checked = true;
         if(form.querySelector('#coolers_yes')) form.querySelector('#coolers_yes').checked = true;
         if(form.querySelector('#service_mobile_bar')) form.querySelector('#service_mobile_bar').checked = true;
         if(form.querySelector('#service_signature_cocktails')) form.querySelector('#service_signature_cocktails').checked = true;
         if(form.querySelector('#service_beer_wine')) form.querySelector('#service_beer_wine').checked = true;
    }
});
