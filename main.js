/*=============== MENU SHOW/HIDDEN ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

/*===== MENU SHOW =====*/
// Validate if navToggle exists before adding listener
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu');
    });
}

/*===== MENU HIDDEN =====*/
// Validate if navClose exists before adding listener
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu');
    });
}

/*=============== REMOVE MENU MOBILE ON LINK CLICK ===============*/
const navLink = document.querySelectorAll('.nav__link');

function linkAction(){
    // When a nav link is clicked, remove the show-menu class to hide the mobile menu
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*=============== EXPERTISE ACCORDION (Replaces Skills) ===============*/
// Note: The HTML structure was changed to cards instead of accordion.
// This section is removed as the accordion JS is no longer needed.
// If you revert to the accordion structure, uncomment and adapt this.
/*
const skillsContent = document.getElementsByClassName('skills__content'),
      skillsHeader = document.querySelectorAll('.skills__header');

function toggleSkills(){
    let itemClass = this.parentNode.className;

    for(let i = 0; i < skillsContent.length; i++){
        skillsContent[i].className = 'skills__content skills__close';
    }

    if(itemClass === 'skills__content skills__close'){
        this.parentNode.className = 'skills__content skills__open';
    }
}

skillsHeader.forEach((el) => {
    el.addEventListener('click', toggleSkills);
});
*/

/*=============== QUALIFICATION TABS (REMOVED) ===============*/
// This section is removed as the Qualification section was removed from HTML.


/*=============== SERVICES MODAL (REMOVED) ===============*/
// This section is removed as the Services section was removed from HTML.


/*=============== PORTFOLIO SWIPER INITIALIZATION ===============*/
// Initialize Swiper for the portfolio section
let swiperPortfolio = new Swiper(".portfolio__container", {
    cssMode: true, // More performant, good for simple sliders
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    // Optional: Add breakpoints for responsive behavior
    // breakpoints:{
    //     568:{ slidesPerView: 2, } // Example: Show 2 slides on medium screens
    // }
});

/*=============== TESTIMONIAL SWIPER INITIALIZATION ===============*/
// Initialize Swiper for the testimonial section
let swiperTestimonial = new Swiper(".testimonial__container", {
    loop: true,
    grabCursor: true,
    spaceBetween: 48, // Space between slides

    pagination: {
      el: ".swiper-pagination-testimonial", // Use specific class for testimonial pagination
      clickable: true,
      dynamicBullets: true, // Bullets change size dynamically
    },
    breakpoints:{
        568:{ // Show 2 slides on screens >= 568px
          slidesPerView: 2,
        }
    }
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
// Highlight the correct nav link when scrolling through sections
const sections = document.querySelectorAll('section[id]'); // Get all sections with an ID

function scrollActive(){
    const scrollY = window.pageYOffset; // Current scroll position

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58; // Offset slightly less than header height
        const sectionId = current.getAttribute('id');
        const correspondingLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if(correspondingLink) { // Check if the link exists in the menu
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                correspondingLink.classList.add('active-link');
            } else {
                correspondingLink.classList.remove('active-link');
            }
        }
    });
}
window.addEventListener('scroll', scrollActive);

/*=============== CHANGE HEADER BACKGROUND ON SCROLL ===============*/
function scrollHeader(){
    const header = document.getElementById('header');
    // When the scroll is greater than 80 viewport height, add the scroll-header class
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

/*=============== SHOW SCROLL TOP BUTTON ===============*/
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll');
}
window.addEventListener('scroll', scrollUp);

/*=============== DARK LIGHT THEME (Optional) ===============*/
// Add logic here if you implement a theme toggle button
/* Example:
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'uil-sun'; // Icon for light mode

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

// Obtain the current theme
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun';

// Validate if the user previously chose a topic
if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
  themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme);
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    // Save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});
*/

/*=============== SCROLL REVEAL ANIMATION (Using Intersection Observer) ===============*/
// Select all elements that should have a reveal animation
const revealElements = document.querySelectorAll('.section[id], .home__content, .about__img, .about__data, .expertise__area, .portfolio__content, .project__container > *, .testimonial__content, .contact__information, .contact__form > *');

const revealObserverOptions = {
    root: null, // Relative to the viewport
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
};

// Callback function for the Intersection Observer
const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible'); // Add class to trigger CSS animation
            // Optional: Add staggered delay using data-attribute or index
            // const delay = entry.target.dataset.delay || 0;
            // entry.target.style.transitionDelay = `${delay}ms`;
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
};

// Create and configure the Intersection Observer
const revealObserver = new IntersectionObserver(revealCallback, revealObserverOptions);

// Add base animation class and observe each element
revealElements.forEach(el => {
    el.classList.add('animated'); // Base class for initial hidden state (opacity: 0, transform)
    revealObserver.observe(el);
});


/*=============== UPDATE FOOTER YEAR ===============*/
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear(); // Automatically set current year
}

/*=============== CONTACT FORM (Basic Frontend - Needs Backend) ===============*/
// Add basic form handling feedback (optional, requires backend for actual sending)
const contactForm = document.getElementById('contact-form'),
      contactMessage = document.getElementById('contact-message-status');

const sendEmail = (e) => {
    if (!contactForm) return; // Exit if form doesn't exist
    e.preventDefault(); // Prevent default form submission

    // Example: Show sending message (replace with actual sending logic)
    contactMessage.textContent = 'Sending...';

    // --- SIMULATE BACKEND INTERACTION ---
    // Replace this timeout with your actual fetch/AJAX call to your backend
    setTimeout(() => {
        // Example success:
        contactMessage.textContent = 'Message sent successfully! ✅';
        contactForm.reset(); // Clear form fields

        // Example error:
        // contactMessage.textContent = 'Message not sent (service error) ❌';

        // Clear message after a few seconds
        setTimeout(() => {
            contactMessage.textContent = '';
        }, 5000);

    }, 2000); // Simulate 2 second delay
};

if (contactForm) {
    contactForm.addEventListener('submit', sendEmail);
}
