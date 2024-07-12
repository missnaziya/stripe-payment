import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/CheckoutForm";

const stripePromise = loadStripe(process.env.REACT_APP_TEST_KEY);

function App() {
  return (
    <div className="App">
      <ToastContainer autoClose={10000} />
      <h2>Stripe Payment Form</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default App;
