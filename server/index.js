require("dotenv").config();
const express = require("express");
const app = express();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");
const PORT = process.env.PORT || 6000;

app.use("/stripe", express.raw({ type: "*/*" }));
app.use(express.json());
app.use(cors());

app.post("/buy", async (req, res) => {
  try {
    // Getting data from client
    let { coin, quantity, amount } = req.body;
    // Simple validation
    if (!coin || !quantity || !amount)
      return res.status(400).json({ message: "Invalid data" });
    amount = parseInt(amount);

    // Initiate payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      payment_method_types: ["card"],
      metadata: { coin, quantity, amount },
    });
    // Extracting the client secret
    const clientSecret = paymentIntent.client_secret;
    // Sending the client secret as response
    res.json({ message: "Payment initiated", clientSecret });
  } catch (err) {
    // Catch any error and send error 500 to client
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Webhook endpoint
app.post("/stripe", async (req, res) => {
  // Get the signature from the headers
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // Check if the event is sent from Stripe or a third party
    // And parse the event
    event = await stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    // Handle what happens if the event is not from Stripe
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
  // Event when a payment is initiated
  if (event.type === "payment_intent.created") {
    console.log(`${event.data.object.metadata.coin} payment initated!`);
  }
  // Event when a payment is succeeded
  if (event.type === "payment_intent.succeeded") {
    // fulfilment
    console.log(`${event.data.object.metadata.coin} payment succeeded!`);
  }
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
