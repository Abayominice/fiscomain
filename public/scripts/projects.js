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

if (contactForm && submitBtn) {
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
}

/* ============================================================
   PROJECTS GALLERY  slow crossfade, rolling thumbnail strip
   ============================================================ */
(function () {
  var stage = document.getElementById("galStage");
  if (!stage) return;

  var slides = Array.prototype.slice.call(stage.querySelectorAll(".gal-slide"));
  if (!slides.length) return;

  var caption  = document.getElementById("galCaption");
  var counter  = document.getElementById("galCounter");
  var progress = document.getElementById("galProgress");
  var strip    = document.getElementById("galStrip");
  var prevBtn  = document.getElementById("galPrev");
  var nextBtn  = document.getElementById("galNext");
  var thumbs   = strip ? Array.prototype.slice.call(strip.querySelectorAll(".gal-thumb")) : [];

  var DWELL = 7000; /* deliberately slow */
  var total = slides.length;
  var current = 0;
  var timer = null;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* the full size original is only fetched when its slide is about to be needed,
     so the page opens fast and the strip runs on light thumbnails */
  function hydrate(i) {
    if (i < 0) i = total + i;
    i = i % total;
    var img = slides[i].querySelector(".gal-photo");
    if (img && !img.getAttribute("src") && img.getAttribute("data-src")) {
      img.setAttribute("src", img.getAttribute("data-src"));
      img.removeAttribute("data-src");
    }
  }

  function hydrateAround(i) {
    hydrate(i);
    hydrate(i + 1);
    hydrate(i + 2);
    hydrate(i - 1);
  }

  function markThumbs(i) {
    for (var t = 0; t < thumbs.length; t++) {
      var isOn = parseInt(thumbs[t].getAttribute("data-target"), 10) === i;
      if (isOn) {
        thumbs[t].classList.add("is-active");
      } else {
        thumbs[t].classList.remove("is-active");
      }
    }
  }

  function restartProgress() {
    if (!progress || reduced) return;
    progress.classList.remove("is-running");
    progress.style.animationDuration = DWELL + "ms";
    /* force reflow so the bar restarts cleanly on every slide */
    void progress.offsetWidth;
    progress.classList.add("is-running");
  }

  function show(i) {
    if (i < 0) i = total - 1;
    if (i >= total) i = 0;

    hydrateAround(i);

    slides[current].classList.remove("is-active");
    current = i;
    slides[current].classList.add("is-active");

    var title = slides[current].getAttribute("data-title") || "";
    if (caption) caption.textContent = title;
    if (counter) counter.textContent = (current + 1) + " / " + total;

    markThumbs(current);
    restartProgress();
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  function start() {
    if (reduced) return;
    stop();
    timer = window.setInterval(next, DWELL);
    restartProgress();
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
    if (progress) progress.classList.remove("is-running");
  }

  if (nextBtn) nextBtn.addEventListener("click", function (e) { e.stopPropagation(); next(); start(); });
  if (prevBtn) prevBtn.addEventListener("click", function (e) { e.stopPropagation(); prev(); start(); });

  for (var t = 0; t < thumbs.length; t++) {
    (function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        show(parseInt(btn.getAttribute("data-target"), 10));
        start();
      });
    })(thumbs[t]);
  }

  /* hovering the stage or the strip holds everything still */
  stage.addEventListener("mouseenter", stop);
  stage.addEventListener("mouseleave", start);
  if (strip) {
    strip.addEventListener("mouseenter", stop);
    strip.addEventListener("mouseleave", start);
  }

  /* arrow keys once the gallery has been touched */
  stage.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { next(); start(); }
    if (e.key === "ArrowLeft")  { prev(); start(); }
  });

  /* swipe on touch devices */
  var touchX = null;
  stage.addEventListener("touchstart", function (e) {
    touchX = e.changedTouches[0].clientX;
    stop();
  }, { passive: true });

  stage.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var delta = e.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 40) {
      if (delta < 0) { next(); } else { prev(); }
    }
    touchX = null;
    start();
  }, { passive: true });

  /* stop burning cycles when the tab is in the background */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(); } else { start(); }
  });

  show(0);
  start();
})();
