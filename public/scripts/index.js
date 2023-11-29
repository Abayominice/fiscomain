
/* When the user clicks on the button for tablet screen (menu2),
toggle between hiding and showing the dropdown content */

function myFunction() {
  const menu_item = document.querySelector(".menuitems2");
  const menu_toggler = document.querySelector(".icimg2");
  menu_item.classList.toggle("show2");
}

function hideNav() {
  const main_menu_is_visible = document.querySelector(".show2");
  if (main_menu_is_visible) {
    const menu_item = document.querySelector(".menuitems2");
    menu_item.classList.remove("show2");
  }
}

/* When the user clicks on the button for mobile screen (menu3),
toggle between hiding and showing the dropdown content */

function myFunction2() {
  const menu_item = document.querySelector(".menuitems3");
  const menu_toggler = document.querySelector(".icimg3");
  menu_item.classList.toggle("show3");
}

function hideNav2() {
  const main_menu_is_visible = document.querySelector(".show3");
  if (main_menu_is_visible) {
    const menu_item = document.querySelector(".menuitems3");
    menu_item.classList.remove("show3");
  }
}

//This section of codes is for the hero image slider
var slideIndex = 1;

var myTimer;

var slideshowContainer;

window.addEventListener("load",function() {
    showSlides(slideIndex);
    myTimer = setInterval(function(){plusSlides(1)}, 4000);
  
    //COMMENT OUT THE LINE BELOW TO KEEP ARROWS PART OF MOUSEENTER PAUSE/RESUME
    //slideshowContainer = document.getElementsByClassName('slideshow-inner')[0];
  
    //UNCOMMENT OUT THE LINE BELOW TO KEEP ARROWS PART OF MOUSEENTER PAUSE/RESUME
    slideshowContainer = document.getElementsByClassName('slideshow-container')[0];
  
    slideshowContainer.addEventListener('mouseenter', pause)
    slideshowContainer.addEventListener('mouseleave', resume)
})

// NEXT AND PREVIOUS CONTROL
function plusSlides(n){
  clearInterval(myTimer);
  if (n < 0){
    showSlides(slideIndex -= 1);
  } else {
   showSlides(slideIndex += 1); 
  }
  
  //COMMENT OUT THE LINES BELOW TO KEEP ARROWS PART OF MOUSEENTER PAUSE/RESUME
  
  if (n === -1){
    myTimer = setInterval(function(){plusSlides(n + 2)}, 4000);
  } else {
    myTimer = setInterval(function(){plusSlides(n + 1)}, 4000);
  }
}

//Controls the current slide and resets interval if needed
function currentSlide(n){
  clearInterval(myTimer);
  myTimer = setInterval(function(){plusSlides(n + 1)}, 4000);
  showSlides(slideIndex = n);
}

function showSlides(n){
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

pause = () => {
  clearInterval(myTimer);
}

resume = () =>{
  clearInterval(myTimer);
  myTimer = setInterval(function(){plusSlides(slideIndex)}, 4000);
}

/* raq submit button*/
function validateFileInput() {
  var fileInput = document.getElementById('email');

  // Check if the number of selected files is greater than 2
  if (fileInput.files.length > 2) {
      alert('Please select a maximum of two files.');
      return false; // Prevent form submission
  }

  return true; // Allow form submission
}

const submitBtn = document.querySelector('.quote-button');
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Change button text to 'Uploading'
    submitBtn.textContent = 'Uploading...';
    submitBtn.disabled = true;

    // Create a FormData object to capture form data
    const formData = new FormData(contactForm);

    // Make a fetch request to your endpoint
    fetch('/submit-form', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
      return response.json()})
    .then(data => {

        submitBtn.textContent = 'Success!';
        submitBtn.disabled = true;
    })
    .catch(error => {

        submitBtn.textContent = 'Error, kindly try again, later.';
    });
});