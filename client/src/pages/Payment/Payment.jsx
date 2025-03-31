import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentFrom from './PaymentFrom';

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_KEY);

const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentFrom />
        </Elements>
    );
};

export default Payment;