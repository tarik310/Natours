/* eslint-disable*/
import '@babel/polyfill';
import { login, logout, sendResetPasswordEmail, ResetPassword } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { signup } from './signup';

import { createReview, deleteReview, updateReview } from './review';

// DOM elements
const mapBox = document.getElementById('map');
const logInForm = document.querySelector('.form--login');
const SignUpForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const reviewForm = document.querySelector('.data_review_form');
const forgotPasswordForm = document.querySelector('.form--forgotpassword');
const resetPasswordForm = document.querySelector('.form--resetpassword');
const filterForm = document.querySelector('.form--filter');
// values

// ***********************************************************
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
// ***********************************************************
if (logInForm) {
  logInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
// ***********************************************************
if (SignUpForm) {
  SignUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}
// ***********************************************************
if (logOutBtn) logOutBtn.addEventListener('click', logout);
// ***********************************************************
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
// ***********************************************************
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
// ***********************************************************
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = document.getElementById('reviewLabel').value;
    const rating = parseInt(document.getElementById('ratingLabel').value);
    const { tourId } = document.querySelector('.tour_review_form').dataset;
    const theReviewButton = document.querySelector(
      `button[data-tour-id="${tourId}"]`,
    );
    const classNames = theReviewButton.classList;
    const classArray = Array.from(classNames);
    if (classArray[1] === 'create_review_btn') {
      createReview(tourId, review, rating);
    }
    if (classArray[1] === 'update_review_btn') {
      const { reviewId } = theReviewButton.dataset;
      updateReview(reviewId, review, rating);
    }

    document.querySelector('.tour_review_form_container').style.display =
      'none';
    theReviewButton.remove();
  });
}

const reviewDeletebtns = document.querySelectorAll('.delete_review_btn');
if (reviewDeletebtns) {
  reviewDeletebtns.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const { reviewId } = e.target.dataset;
      const reviewCard = document.getElementById(`review-${reviewId}`);
      deleteReview(reviewId);
      reviewCard.remove();
    });
  });
}

/****************************************************** */
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    sendResetPasswordEmail(email);
    document.getElementById('email').value = '';
  });
}
/********************************************************* */
if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const token = window.location.pathname.split('/').pop();
    ResetPassword(token, password, passwordConfirm);
  });
}

/******************************************** filter Form */

if (filterForm) {
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(filterForm);

    const sort = formData.get('sort');
    const duration = formData.get('duration');
    const difficulty = formData.get('difficulty');
    const queryParams = {};

    if (sort) queryParams['sort'] = sort;
    if (duration) queryParams['duration'] = duration;
    if (difficulty) queryParams['difficulty'] = difficulty;

    const newQueryString = new URLSearchParams(queryParams).toString();
    // Replace the current URL with the new URL containing the filtered query
    const newUrl = `${window.location.pathname}?${newQueryString}`;
    window.history.replaceState({}, document.title, newUrl);
    // Reload the page
    window.location.reload();
  });
}

// Wait for the document to fully load
document.addEventListener('DOMContentLoaded', function () {
  // Parse the query parameters from the URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // Select the <select> elements and the input element
  const sortSelect = document.querySelector('#sort');
  const difficultySelect = document.querySelector('#difficulty');
  const durationInput = document.querySelector('#duration');

  // Set the selected options based on query parameters
  const sortValue = urlParams.get('sort');
  const difficultyValue = urlParams.get('difficulty');
  const durationValue = urlParams.get('duration');

  if (sortSelect && sortValue) {
    // Set the selected option for sortSelect
    const sortOption = sortSelect.querySelector(`option[value="${sortValue}"]`);
    if (sortOption) {
      sortOption.selected = true;
    }
  }

  if (difficultySelect && difficultyValue) {
    // Set the selected option for difficultySelect
    const difficultyOption = difficultySelect.querySelector(
      `option[value="${difficultyValue}"]`,
    );
    if (difficultyOption) {
      difficultyOption.selected = true;
    }
  }

  if (durationInput && durationValue) {
    // Set the value for the duration input
    durationInput.value = durationValue;
  }
});
