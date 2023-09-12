import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51NjPllJ2OvdEbtEIZ5hfxPScMxF5XK5GXNlNa1EAjc26h5cej3VbUZlePvHLWPkuolTf0595Il0M1EqS6ZkPqRQf00iVvDcUgo',
);

export const bookTour = async (tourId) => {
  try {
    // 1- get check out session from api
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );
    // 2- create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
