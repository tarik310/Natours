/*eslint-disable*/

const settingsbtn = document.getElementById('settings');
const bookingsbtn = document.getElementById('bookings');
const reviewsbtn = document.getElementById('reviews');
const billingsbtn = document.getElementById('billings');

const settingsPanel = document.getElementById('settings_panel');
const bookingsPanel = document.getElementById('booking_panel');
const reviewsPanel = document.getElementById('reviews_panel');
const billingsPanel = document.getElementById('billings_panel');

settingsbtn.addEventListener('click', (e) => {
  e.preventDefault();
  settingsPanel.style.display = 'block';
  bookingsPanel.style.display = 'none';
  reviewsPanel.style.display = 'none';
  billingsPanel.style.display = 'none';
});
bookingsbtn.addEventListener('click', (e) => {
  e.preventDefault();
  settingsPanel.style.display = 'none';
  bookingsPanel.style.display = 'block';
  reviewsPanel.style.display = 'none';
  billingsPanel.style.display = 'none';
});
reviewsbtn.addEventListener('click', (e) => {
  e.preventDefault();
  settingsPanel.style.display = 'none';
  bookingsPanel.style.display = 'none';
  reviewsPanel.style.display = 'block';
  billingsPanel.style.display = 'none';
});
billingsbtn.addEventListener('click', (e) => {
  e.preventDefault();
  settingsPanel.style.display = 'none';
  bookingsPanel.style.display = 'none';
  reviewsPanel.style.display = 'none';
  billingsPanel.style.display = 'block';
});

const sideNavItems = document.querySelectorAll('.side-nav-item');

sideNavItems.forEach((item) => {
  item.addEventListener('click', () => {
    // Remove 'side-nav--active' class from all items
    sideNavItems.forEach((navItem) => {
      navItem.classList.remove('side-nav--active');
    });

    // Add 'side-nav--active' class to the clicked item
    item.classList.add('side-nav--active');
  });
});

/***************************************************************** review Form */
function updateStars(value) {
  const stars = document.querySelectorAll('.reviews__star');
  for (let i = 0; i < stars.length; i++) {
    stars[i].classList.toggle('reviews__star--active', i < value);
  }
}
const closebtn = document.getElementById('close_review_form');
const reviewformContainer = document.querySelector(
  '.tour_review_form_container',
);

closebtn.addEventListener('click', (e) => {
  e.preventDefault();
  reviewformContainer.style.display = 'none';
});

const reviewButtons = document.querySelectorAll('.review_btn');
const tourReviewForm = document.querySelector('.tour_review_form');
const h1Element = document.createElement('h1');

reviewButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const { tourId, tourName } = e.target.dataset;
    h1Element.textContent = tourName;
    reviewformContainer.style.display = 'block';
    tourReviewForm.setAttribute('data-tour-id', tourId);
    tourReviewForm.insertBefore(h1Element, tourReviewForm.firstChild);
  });
});
