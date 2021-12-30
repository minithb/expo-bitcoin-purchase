import { useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import NumberFormat from "react-number-format";

export default function Checkout() {
  const [price, setPrice] = useState(50000);
  const [totalCoins, setTotalCoins] = useState(1.91342865);
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
      const response = await fetch(
        "https://expo-bitcoin-purchase.herokuapp.com/buy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coin: "Bitcoin",
            quantity: quantity,
            amount: finalAmount,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return Alert.alert(data.message);
      }
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "Bitcoin Buy",
      });
      if (initSheet.error) {
        // console.error(initSheet.error);
        return Alert.alert(initSheet.error.message);
      }
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret: data.clientSecret,
      });
      if (presentSheet.error) {
        // console.error(presentSheet.error);
        return Alert.alert(presentSheet.error.message);
      }
      Alert.alert("Payment successfully! Thank you for the purchase.");
      setTotalCoins(totalCoins + parseInt(quantity));
    } catch (err) {
      // console.error(err);
      Alert.alert("Payment failed!");
    }
  };

  return (
    <>
      {/* Wallet View */}
      <View style={styles.container}>
        <Text style={[styles.title, { paddingTop: 20 }]}>
          <Ionicons name="wallet-outline" size={24} color="#333" /> Wallet
        </Text>
        <Text style={{ paddingTop: 30 }}>Equity Value(BTC)</Text>
        <View style={styles.value}>
          <Text style={styles.totalCoins}>{totalCoins}</Text>
          <Text style={styles.totalValue}>
            {" "}
            ≈
            <NumberFormat
              displayType="text"
              thousandSeparator={true}
              thousandsGroupStyle="lakh"
              prefix={"  ₹"}
              value={Math.floor(totalCoins * price)}
              renderText={(value) => <Text>{value}</Text>}
            />
          </Text>
        </View>
        <View style={[styles.value, { marginTop: 30 }]}>
          <Text style={{ marginTop: 5, flex: 4, paddingLeft: 25 }}>Coin</Text>
          <Text style={styles.balance}>Balance</Text>
        </View>

        {/* Bitcoin row */}
        <View style={styles.value}>
          <MaterialCommunityIcons name="bitcoin" size={28} color="#f2a900" />
          <Text style={styles.coin}> Bitcoin</Text>
          <Text style={styles.coinBalance}>{totalCoins}</Text>
        </View>

        {/* Ethereum row */}
        <View style={styles.value}>
          <MaterialCommunityIcons name="ethereum" size={28} color="#3c3c3d" />
          <Text style={styles.coin}> Ethereum</Text>
          <Text style={styles.coinBalance}>0.00</Text>
        </View>
      </View>

      {/* Buy View */}
      <View style={styles.container}>
        <Text style={styles.title}>
          <Ionicons name="swap-horizontal-outline" size={24} color="#333" />{" "}
          BTC/INR
        </Text>
        <Text style={[styles.totalCoins, { textAlign: "center" }]}>
          <NumberFormat
            displayType="text"
            thousandSeparator={true}
            thousandsGroupStyle="lakh"
            prefix={"₹"}
            value={price}
            renderText={(value) => <Text>{value}</Text>}
          />
        </Text>
        <View style={[styles.value, { marginTop: 30 }]}>
          <Text style={{ marginTop: 5, flex: 1, paddingLeft: 25 }}>
            Quantity
          </Text>
          <Text style={styles.amount}>Amount</Text>
        </View>
        <View style={[styles.value, { marginTop: 5 }]}>
          <TextInput
            placeholder="1"
            style={styles.textInput}
            value={quantity}
            onChangeText={(e) => setQuantity(e)}
          />
          <Text style={[styles.amount, { fontSize: 16 }]}>
            <NumberFormat
              displayType="text"
              thousandSeparator={true}
              thousandsGroupStyle="lakh"
              prefix={"₹"}
              value={amount}
              renderText={(value) => <Text>{value}</Text>}
            />
          </Text>
        </View>

        {/* Buy button */}
        <TouchableOpacity
          key="Buy"
          onPress={buy}
          style={styles.button}
          disabled={quantity <= 0}
        >
          <Text style={styles.buttonLabel}>Buy BTC</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "#0ecb81",
    alignSelf: "center",
    marginHorizontal: "1%",
    marginBottom: 6,
    marginTop: 70,
    minWidth: "48%",
    textAlign: "center",
    borderWidth: 0,
  },
  buttonLabel: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 24,
    color: "#333",
  },
  totalCoins: {
    fontSize: 28,
    color: "#333",
  },
  totalValue: {
    padding: 5,
    marginTop: 5,
  },
  value: {
    flexDirection: "row",
  },
  coin: {
    marginTop: 5,
    flex: 2,
    fontSize: 16,
  },
  coinBalance: {
    marginTop: 5,
    flex: 1,
    textAlign: "center",
    fontSize: 16,
  },
  amount: {
    marginTop: 5,
    flex: 4,
    textAlign: "right",
    marginRight: 15,
  },
  textInput: {
    marginLeft: 18,
    padding: 10,
    borderColor: "black",
    borderWidth: 0.5,
    flex: 1,
  },
  balance: {
    marginTop: 5,
    flex: 1,
    textAlign: "left",
    marginRight: 15,
  },
});
