import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import Checkout from "./components/Checkout";

export default function App() {
  return (
    <View style={styles.container}>
      <StripeProvider publishableKey="pk_test_51JpykoSAQwW5QLe07A81QSN7eOr7MwJJEoZuUmGTLR89Utg5PDYC9b8U0xeHRwe6JsZ9cB2Iu4HIIW77m8WrJaug0044zPoHP4">
        <Checkout />
      </StripeProvider>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
