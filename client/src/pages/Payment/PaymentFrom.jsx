import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate, useParams } from "react-router"
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  showCloseButton: true,
  closeButtonAriaLabel: "Close",
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { biodataId } = useParams();
  // Fetch logged-in user's biodata
  const { data: biodata = [] } = useQuery({
    queryKey: ["biodata", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/biodata?email=${user.email}`, {
        withCredentials: true
      });
      return res.data;
    },
    enabled: !!user.email, // Only fetch if user email exists
  });

  const userBiodata = biodata[0] || null; // Take the first biodata entry
  const amountInCents = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !userBiodata) return;

    // STEP 1: Get card info
    const card = elements.getElement(CardElement);
    if (!card) return;

    // STEP 2: Create a Payment Method in Stripe
    const { error } = await stripe.createPaymentMethod({
      type: 'card',
      card,
      billing_details: {
        name: userBiodata.name,
        email: userBiodata.contactEmail,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // STEP 2: Create Payment Intent on the server
    const res = await axiosSecure.post('/create-payment-intent', { amountInCents }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
    const clientSecret = res.data.clientSecret;

    // STEP 4: Confirm the payment with the client secret
    const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });

    if (result.error) {
      setErrorMessage(`Payment failed: ${result.error.message}`);
      return;
    }

    // STEP 5: Save payment info to the backend database
    if (result.paymentIntent.status === 'succeeded') {
      setErrorMessage("");

      // Save payment details to the server
      await axiosSecure.post('/payments', {
        name: userBiodata.name,
        email: userBiodata.contactEmail,
        amount: amountInCents,
        paymentId: result.paymentIntent.id,
        status: result.paymentIntent.status,
        date: new Date().toISOString(),
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      Toast.fire({ icon: 'success', title: 'Payment Successful!' });
      
      navigate(`/biodata/${biodataId}`);
      // STEP 6: Optional - refresh payment queries if used elsewhere
      queryClient.invalidateQueries(['payments', userBiodata.contactEmail]);
    }
  };

  return (
    <div className="w-11/12 md:max-w-md mx-auto my-12 bg-white shadow-lg rounded-xl p-6 border border-pink-200">
      <h2 className="text-2xl font-semibold text-pink-700 mb-4 text-center">Secure Payment</h2>
      <p className="text-gray-600 mb-4 text-center">
        Pay $5 to unlock contact information.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
          {/* STEP 6a: Stripe Card input */}
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#4B5563',
                '::placeholder': { color: '#9CA3AF' },
              },
              invalid: {
                color: '#DC2626',
              },
            },
          }} />
        </div>

        <button type="submit" disabled={!stripe}
          className="w-full bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary cursor-pointer text-white font-medium py-3 rounded-lg transition duration-300">
          Pay $5
        </button>

        {errorMessage && (<p className="text-red-500 text-center mt-2 font-medium">{errorMessage}</p>)}
      </form>
    </div>
  );
};

export default PaymentForm;