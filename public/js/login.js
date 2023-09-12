/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';
import catchAsync from '../../utils/catchAsync';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signin',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/signout',
    });
    if ((res.data.status = 'success')) {
      // location.reload(true);
      setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
export const sendResetPasswordEmail = catchAsync(async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/forgotpassword',
      data: {
        email,
      },
    });
    if ((res.status = 'success')) {
      // location.reload(true);
      showAlert('success', res.data.message);
      setTimeout(() => {
        location.assign('/');
      }, 5000);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Failed to reset password! Try again.');
  }
});

export const ResetPassword = catchAsync(
  async (token, password, passwordConfirm) => {
    try {
      const res = await axios({
        method: 'PATCH',
        url: `http://127.0.0.1:3000/api/v1/users/resetpassword/${token}`,
        data: {
          password,
          passwordConfirm,
        },
      });
      if ((res.status = 'success')) {
        // location.reload(true);
        showAlert('success', 'password is set successfully');
        setTimeout(() => {
          location.assign('/login');
        }, 1500);
      }
    } catch (err) {
      console.log(err);
      showAlert('error', 'Failed to reset password! Try again.');
    }
  },
);
