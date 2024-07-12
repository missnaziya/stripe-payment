import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { BASE_URL } from "../BASE_URL";
import axios from "axios";
import { toast } from "react-toastify";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [inProgress, setInProgress] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (country === "IN" && !address) {
      toast.error("Address is required for India.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    setInProgress(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        email: email,
        address: {
          country: country,
          line1: address,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setInProgress(false);
      return;
    }

    const { id } = paymentMethod;

    try {
      const response = await axios.post(`${BASE_URL}/charge`, {
        id,
        email,
        amount: parseFloat(amount) * 100,
        address,
        country,
      });
      // console.log("result:::",response);

      if (response?.data?.success) {
        toast.success("Payment Successful!");
        setInProgress(false);
        setEmail('');
        setAmount('');
        setCountry('');
        setAddress('');
        elements.getElement(CardElement).clear();
      } else {
        const error = response;
        console.error("ERROR:",error);
        toast.error(error.message);
        setInProgress(false);
      }
    } catch (error) {
      console.error("ERROR:",error);
      toast.error(error.response.data.error);
      setInProgress(false);
    }
  };


  const cardElementOptions = {
    style: {
      base: {
        color: '#000',
        fontSize: '14px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
      >
        <option value="" disabled>
          Select Country
        </option>
        <option value="US">United States</option>
        <option value="IN">India</option>
        <option value="GB">United Kingdom</option>
        <option value="CA">Canada</option>
      </select>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
        required={country === "IN"}
      />
      <CardElement className="CardElement" options={cardElementOptions}/>
      <button type="submit" disabled={!stripe} className={inProgress ? 'inprogress' : ''}>
        {inProgress ? 'In Progress...' : 'Pay'}
      </button>
    </form>
  );
};

export default CheckoutForm;
