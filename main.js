document.addEventListener("DOMContentLoaded", () => {
    const slideshowImages = document.querySelectorAll(".slideshow-container .slideshow-img");
    
    const nextImageDelay = 4500;
    let currentImageCounter = 0;
    
    slideshowImages[currentImageCounter].style.opacity = 1;
    
    setInterval(nextImage, nextImageDelay);
    
    function nextImage() {
        slideshowImages[currentImageCounter].style.opacity = 0;
        currentImageCounter = (currentImageCounter + 1) % slideshowImages.length;
        slideshowImages[currentImageCounter].style.opacity = 1;
    }
})

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('contact-form');
    const result = document.getElementById('result');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous result messages
        result.innerHTML = "";

        // Validate form fields
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name === "" || email === "" || message === "") {
            result.innerHTML = "Please fill in all fields.";
            return;
        }

        // Form data
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        
        result.innerHTML = "Please wait...";

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
                result.innerHTML = "Form submitted successfully";
                setTimeout(() => {
                    window.location.href = "https://noahruckman18.github.io/Mary_Katherines_Mobile_Mixers/Submit.html";
                }, 1000);
            } else {
                result.innerHTML = jsonResponse.message;
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
        })
        .then(() => {
            form.reset();
            setTimeout(() => {
                result.style.display = "none";
            }, 3000);
        });
    });
});