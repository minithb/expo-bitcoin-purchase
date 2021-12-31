[![runs with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-000.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/@minith/expo-bitcoin-purchase)

# expo-bitcoin-purchase

<!-- ![RemoteUp Logo](./src/assets/img/RemoteUpLogo.png) -->

An app to you buy dummy bitcoin. The wallet balance is updated on succesfully payment. The intent of building this is to showcase In-App Purchase using Stripe.

Building this app gave me the opportunity to really stretch out and craft my first app.

Welcome! I hope this app helps you learn about In-App Purchases using Stripe & Expo.

<br/>

# Table of Content

1. [Demo](#demo)
2. [Installation](#installation)
3. [Technology Stack](#technology-stack)
4. [Authors](#authors)
5. [License](#license)

<br/>

# Demo

For Android, download the [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) app from play store. Scan the QR code in [this](https://expo.dev/@minith/expo-bitcoin-purchase) link from your Expo Go app.

For iOS, a paid plan is required to run app usin Expo Go.

Test card details:

We have integrated Stripe checkout. To buy, you'll need to make a dummy payment on Stripe checkout. Use the following details:

- Card Number: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any random 3 digit number

_Tip: Keep pressing 4 & 2 on payment screen._

# Installation

- Fork or directly clone this repository to your local machine

**Client**:

- Make sure you have [expo-cli](https://www.npmjs.com/package/expo-cli) installed
- Install [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/) & [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- Use the `yarn` or `npm install` command to install dependencies
- Once the dependencies are finished installing, use the `expo start` command inside the root directory to start the project
- Press `a` to run on Android emulator or `i` to run on iOS simulator

_Note: If you're using MacBook with M1(Apple Silicon) chip, while installing Android Studio emulator, in AVD manager, while creating new virtual device, select `Pixel XL` device, and select `R` system image._

**Server**:

- Navigate to server folder - `cd server`
- Use the `npm install` command to install dependencies
- Install nodemon - `npm install -g nodemon`
- Run `nodemon index.js` to start the server

To test Stripe webhooks on local environment, check out [this](https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local) guide. You can also use [Stripe VS Code extension](https://stripe.com/blog/stripe-extension-for-vs-code).

_Note: If you're using MacBook with M1(Apple Silicon) chip, the Stripe VS Code extension may not detect the stripe-cli installed on your machine, if it asks for path to executable, use this path - `/usr/local/bin/stripe`_

# Technology Stack

I tried to use a completely modern tech stack while testing out some new technologies that I had never used before. This resulted in a fast, performant, and easily-extensible iOS & android app that should be fairly future-proof for the coming next several years. I used:

**Client**

- [expo](https://github.com/expo/expo)
- [react-native](https://github.com/facebook/react-native)
- [stripe-react-native](https://github.com/stripe/stripe-react-native)
- [react-number-format](https://github.com/s-yadav/react-number-format)

**Server**

- [cors](https://github.com/expressjs/cors)
- [express](https://github.com/expressjs/express)
- [stripe](https://github.com/stripe/stripe-node)

# Authors

- [Minith Jain](https://www.github.com/minithb)

# License

[MIT](https://opensource.org/licenses/MIT)
