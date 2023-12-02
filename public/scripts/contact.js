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
  


const submitBtn = document.querySelector('.pry-btn');
const form = document.querySelector('.contact-form');

form.addEventListener('submit', function (event) {

    event.preventDefault(); // Prevent the default form submission behavior

    // Change button text to 'Submitting'
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Create a FormData object to capture form data

    const formData = new FormData(form);

    // Make a fetch request to your endpoint
    fetch('/submit-contact-form', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Change button text to 'Success' and disable the button
        submitBtn.textContent = 'Success!';
        submitBtn.disabled = true;
    })
    .catch(error => {
        console.error(error);
        // Change button text to 'Error' if there is an issue
        submitBtn.textContent = 'Error';
    });
});