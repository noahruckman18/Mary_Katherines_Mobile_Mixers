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
    },  2000);
    return True; // Prevent page refresh
 }  


 const form = document.getElementById('form');
 const result = document.getElementById('result');
 
 form.addEventListener('submit', function(e) {
   e.preventDefault();
   const formData = new FormData(contact-form);
   const object = Object.fromEntries(formData);
   const json = JSON.stringify(object);
   result.innerHTML = "Please wait..."
 
     fetch('https://noahruckman18.github.io/Mary_Katherines_Mobile_Mixers/Submit.html', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Accept': 'application/json'
             },
             body: json
         })
         .then(async (response) => {
             let json = await response.json();
             if (response.status == 200) {
                 result.innerHTML = "Form submitted successfully";
             } else {
                 console.log(response);
                 result.innerHTML = json.message;
             }
         })
         .catch(error => {
             console.log(error);
             result.innerHTML = "Something went wrong!";
         })
         .then(function() {
             form.reset();
             setTimeout(() => {
                 result.style.display = "none";
             }, 3000);
         });
 });