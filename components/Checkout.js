import { useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
    <>
      {/* Wallet View */}
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={[styles.title, { paddingTop: 10 }]}>
          <Ionicons name="wallet-outline" size={24} color="#333" /> Wallet
        </Text>
        <Text style={{ paddingTop: 30 }}>Equity Value(BTC)</Text>
        <View style={styles.value}>
          <Text style={styles.totalCoins}>{totalCoins}</Text>
          <Text style={styles.totalValue}>
            ≈ ₹{Math.floor(totalCoins * price).toLocaleString()}
          </Text>
        </View>
        <View style={[styles.value, { marginTop: 30 }]}>
          <Text style={{ marginTop: 5, flex: 4, paddingLeft: 25 }}>Coin</Text>
          <Text
            style={{
              marginTop: 5,
              flex: 1,
              textAlign: "left",
              marginRight: 15,
            }}
          >
            Balance
          </Text>
        </View>

        {/* Bitcoin row */}
        <View style={styles.value}>
          <MaterialCommunityIcons name="bitcoin" size={28} color="#f2a900" />
          <Text style={{ marginTop: 5, flex: 2, fontSize: 16 }}> Bitcoin</Text>
          <Text
            style={{
              marginTop: 5,
              flex: 1,
              textAlign: "center",
              fontSize: 16,
            }}
          >
            {totalCoins}
          </Text>
        </View>

        {/* Ethereum row */}
        <View style={styles.value}>
          <MaterialCommunityIcons name="ethereum" size={28} color="#3c3c3d" />
          <Text style={{ marginTop: 5, flex: 2, fontSize: 16 }}> Ethereum</Text>
          <Text
            style={{
              marginTop: 5,
              flex: 1,
              textAlign: "center",
              fontSize: 16,
            }}
          >
            0.00
          </Text>
        </View>
      </View>

      {/* Buy View */}
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={styles.title}>
          <Ionicons name="swap-horizontal-outline" size={24} color="#333" />{" "}
          BTC/INR
        </Text>
        <Text style={[styles.totalCoins, { textAlign: "center" }]}>
          ₹{price.toLocaleString()}
        </Text>
        <View style={[styles.value, { marginTop: 30 }]}>
          <Text style={{ marginTop: 5, flex: 1, paddingLeft: 25 }}>
            Quantity
          </Text>
          <Text
            style={{
              marginTop: 5,
              flex: 4,
              textAlign: "right",
              marginRight: 15,
            }}
          >
            Amount
          </Text>
        </View>
        <View style={[styles.value, { marginTop: 5 }]}>
          <TextInput
            placeholder="1"
            style={{
              marginLeft: 18,
              padding: 10,
              borderColor: "black",
              borderWidth: 0.5,
              // width: 70,
              flex: 1,
            }}
            value={quantity}
            onChangeText={(e) => setQuantity(e)}
          />
          <Text
            style={{
              marginTop: 5,
              flex: 4,
              textAlign: "right",
              marginRight: 15,
              fontSize: 16,
            }}
          >
            ₹{amount.toLocaleString()}
          </Text>
        </View>

        {/* Buy button */}
        <TouchableOpacity
          key="Buy"
          onPress={buy}
          style={[styles.button, { marginTop: 70 }]}
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
    flex: 1,
    marginTop: 8,
    backgroundColor: "aliceblue",
    minHeight: 200,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "#0ecb81",
    alignSelf: "center",
    marginHorizontal: "1%",
    marginBottom: 6,
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
    fontWeight: "600",
  },
  totalCoins: {
    fontSize: 28,
    color: "#333",
  },
  totalValue: {
    padding: 5,
    marginTop: 5,
  },
  value: { flexDirection: "row" },
});
