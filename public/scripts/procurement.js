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
  