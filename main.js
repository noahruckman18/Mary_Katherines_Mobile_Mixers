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

function submitForm() {
    var frm = document.getElementsByName('contact-form')[0];
    frm.submit(); // Submit the form
    setTimeout(function(){
        frm.reset(); // Reset all form data
    },  1000);
    return True; // Prevent page refresh
 }  