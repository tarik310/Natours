import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async (tourId, review, rating) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/tours/${tourId}/reviews`,
      data: {
        review,
        rating,
      },
    });
    if ((res.data.status = 'success')) {
      showAlert('success', 'Review created successfully');
      setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error Creating review! Try again.');
  }
};
export const deleteReview = async (reviewId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/api/v1/reviews/${reviewId}`,
    });

    if ((res.status = 'success')) {
      // location.reload(true);
      showAlert('success', 'Review deleted successfully');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error deleting review! Try again.');
  }
};

export const updateReview = async (reviewId, review, rating) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/reviews/${reviewId}`,
      data: {
        review,
        rating,
      },
    });
    if ((res.data.status = 'success')) {
      // location.reload(true);
      showAlert('success', 'Review updated successfully');
      setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error updating review! Try again.');
  }
};
