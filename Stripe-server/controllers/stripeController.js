const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentIntent = async (req, res) => {
  try {
    const { id, email, amount, address, country } = req.body;
    const payment = await stripe.paymentIntents.create({
      amount: amount, // amount in cents
      currency: 'usd',
      payment_method: id,
      receipt_email: email,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      shipping: {
        address: {
          line1: address,
          country: country,
        },
        name: email,
      },
    });

    res.send({ success: true });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { paymentIntent };
