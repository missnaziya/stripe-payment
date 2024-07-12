const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const bodyParser = require("body-parser");
const router = require("./routes/route");

// enable cors
app.use(cors());
// enable body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// route
app.use("/stripe-api", router);

app.listen(PORT, () => {
  console.log(`server is listen on PORT=${PORT}`);
});
