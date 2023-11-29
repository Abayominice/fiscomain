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
  
  const projectDetails = document.querySelectorAll("#project-details-slide>div");

projectDetails.forEach((el)=> { 
    el.addEventListener("mouseover", ()=>{ 
        fadeUpShow(el.querySelector(".project-details-link"));
        fadeUpHide(el.querySelector(".project-details-title"));
    });

    el.addEventListener("mouseout", ()=>{
        removeFadeUpShow(el.querySelector(".project-details-link"));
        removeFadeUpHide(el.querySelector(".project-details-title"));
    });


} )


function fadeUpShow(el){

    if(!el.classList.contains("animate-fadeupshow")){
        el.classList.add("animate-fadeupshow");
    }
}

function removeFadeUpShow(el){
    if(el.classList.contains("animate-fadeupshow")){
        el.classList.remove("animate-fadeupshow");
    }
}

function fadeUpHide(el){
    if(!el.classList.contains("animate-fadeuphide")){
        el.classList.add("animate-fadeuphide");
    }
}

function removeFadeUpHide(el){
    if(el.classList.contains("animate-fadeuphide")){
        el.classList.remove("animate-fadeuphide");
    }
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