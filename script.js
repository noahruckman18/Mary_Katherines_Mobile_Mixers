document.addEventListener("DOMContentLoaded", () => {
    // Loader
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');

    setTimeout(() => {
        if(loader) {
            loader.style.opacity = '0';
        }
        if(mainContent) {
            mainContent.style.opacity = '1';
        }
         setTimeout(() => {
            if(loader) loader.style.display = 'none';
         }, 500);
    }, 3500);

    // Mobile Menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('header a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    const singleHeroImage = document.querySelector(".slideshow-container .slideshow-img");
    if (singleHeroImage && document.querySelectorAll(".slideshow-container .slideshow-img").length === 1) {
        singleHeroImage.classList.add('active');
    }

    // Contact Form Submission
    const form = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');
    const submitButton = document.getElementById('btnsubmit');

    if (form && formResult && submitButton) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            formResult.innerHTML = "";
            formResult.className = "mb-4 text-sm font-body-text";

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === "" || email === "" || message === "") {
                formResult.innerHTML = "Please fill in all required fields.";
                formResult.classList.add('text-red-600');
                return;
            }

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            formResult.innerHTML = "Please wait...";
            formResult.classList.add('text-dark-blue');
            submitButton.disabled = true;
            submitButton.classList.add('opacity-50', 'cursor-not-allowed');

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
                if (response.status == 200) {
                    formResult.innerHTML = "Form submitted successfully! We'll be in touch soon.";
                    formResult.classList.remove('text-dark-blue');
                    formResult.classList.add('text-green-600');
                    form.reset();
                } else {
                    formResult.innerHTML = jsonResponse.message || "An error occurred. Please try again.";
                    formResult.classList.remove('text-dark-blue');
                    formResult.classList.add('text-red-600');
                }
            })
            .catch(error => {
                console.error("Form submission error:", error);
                formResult.innerHTML = "Something went wrong! Please check your connection or try again later.";
                formResult.classList.remove('text-dark-blue');
                formResult.classList.add('text-red-600');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            });
        });
    }

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});