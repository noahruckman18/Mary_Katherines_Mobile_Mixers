const slideshowImages = document.querySelectorAll(".slideshow .slideshow-img");

const nextImageDelay = 4500;
let currentImageCounter = 0;

slideshowImages[currentImageCounter].style.opacity = 1;

setInterval(nextImage, nextImageDelay);
function nextImage() {
    slideshowImages[currentImageCounter].style.zIndex = -2;
    const tempCounter = currentImageCounter
    setTimeout(() => {
        slideshowImages[tempCounter].style.opacity = 0;
    }, 100);
    currentImageCounter = (currentImageCounter + 1) % slideshowImages.length;
    slideshowImages[currentImageCounter].style.opacity = 1;
    slideshowImages[currentImageCounter].style.zIndex = -1;
}