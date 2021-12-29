import { useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";

export default function Checkout() {
  const [price, setPrice] = useState(50000);
  const [totalCoins, setTotalCoins] = useState(1);
  const [quantity, setQuantity] = useState("1");
  const [amount, setAmount] = useState(quantity * price);
  const stripe = useStripe();

  useEffect(() => {
    setTimeout(() => {
      let newPrice;
      if (Math.random() > 0.5) {
        newPrice = Math.floor(price * 1.015);
        setPrice(newPrice);
      } else {
        newPrice = Math.floor(price * 0.985);
        setPrice(newPrice);
      }
    }, 5000);
  }, [price]);

  useEffect(() => {
    setAmount(price * quantity);
  }, [quantity, price]);

  const buy = async () => {
    try {
      const finalAmount = parseInt(amount);
      const response = await fetch("http://localhost:6000/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coin: "Bitcoin",
          quantity: quantity,
          amount: finalAmount,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return Alert.alert(data.message);
      }
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "Bitcoin Buy",
      });
      if (initSheet.error) {
        console.error(initSheet.error);
        return Alert.alert(initSheet.error.message);
      }
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret: data.clientSecret,
      });
      if (presentSheet.error) {
        console.error(presentSheet.error);
        return Alert.alert(presentSheet.error.message);
      }
      Alert.alert("Payment successfully! Thank you for the purchase.");
      setTotalCoins(totalCoins + parseInt(quantity));
    } catch (err) {
      console.error(err);
      Alert.alert("Payment failed!");
    }
  };

  return (
    <View>
      <Text>Wallet</Text>
      <Text>Total Value(BTC)</Text>
      <Text>
        {totalCoins} = ₹{totalCoins * price}
      </Text>
      <Text>Bitcoin</Text>
      <Text>Buy more</Text>
      <Text>₹{price}</Text>
      <Text>Quantity</Text>
      <TextInput
        placeholder="1"
        style={{
          padding: 10,
          borderColor: "black",
          borderWidth: 0.5,
          width: 70,
        }}
        value={quantity}
        onChangeText={(e) => setQuantity(e)}
      />
      <Text>₹{amount}</Text>
      <Button title="Buy" onPress={buy} />
    </View>
  );
}
