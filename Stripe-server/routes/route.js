const router = require("express").Router();
const { paymentIntent } = require("../controllers/stripeController");

router.post("/charge", paymentIntent);

module.exports = router;
