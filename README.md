# Buttercup Mobile
> Mobile vault application for Buttercup Password Manager

## About
This repository holds the source for the Buttercup mobile application, which is available for the following platforms:

 * iOS **13+**
 * Android **13+**

_Currently only phones are supported, not tablets._

The mobile application allows for full integration with Buttercup archives stored on a variety of platforms. Like the other applications, this mobile application makes use of **AES 256bit encryption** with over **200k PBKDF2 password derivation iterations**.

The Buttercup for Mobile application boasts the following features:

 * On-device encryption and decryption
 * Auto-hide screen when app is sent to background (like banking apps)
 * Auto-lock vaults after a certain period of inactivity
 * Add/Edit/Delete entries
 * Unlock vaults even when offline (read-only)
 * Autofilling of login forms in Safari (iOS only)
 * Password generator
 * Biometric access

You can read about the changes and releases of the application in the [changelog](CHANGELOG.md).

### Introduction
This project uses **React Native** to build _native_ iOS and Android applications from a React/JavaScript codebase. The majority of the codebase is JavaScript which utilises the following platforms:

 * ReactJS
 * Redux
 * React Native Router Flux

As Buttercup makes use of strong cryptography, certain encryption/decryption tasks are performed using pure native code (Objective-C/Java). Only the bare minimum required for increased performance is handled on the native side, with the rest being solely JavaScript.

## Installation
Ensure that you're using **NodeJS 14** or newer on OSX. Android projects can be built and tested on Linux and Windows, but these platforms are _not officially supported_.

Before getting started, ensure you follow the [official React Native Getting Started guide](https://facebook.github.io/react-native/docs/getting-started.html) for your desired platform (iOS/Android). It is also recommended to have the react-native-cli installed:

```shell
npm install -g react-native-cli
```

Run the following to initialise the project:

```shell
npm install
```

Once all dependencies are installed and your target development environments are setup (Xcode for iOS and Android Studio for Android), it should be possible to begin development with virtual devices.

**Important note about Node.js support**: Development for this project should be performed on Node version 8. Although it may work on versions 6 and newer, we will not be supporting issues raised for these versions. Similarly, we do not currently support NodeJS version 9.

### iOS development
Providing Xcode is setup correctly, running the following will launch the application in an iPhone emulator:

```shell
npm run ios
```

### Android development
Ensure that Android Studio is setup correctly and that an AVD has been created. The virtual device must be on **API level 23** or greater running **Android 6.0** or newer. You must have the AVD started before continuing with no other devices connected. To ensure you only have one device running, execute the following on the command-line:

```shell
adb devices
```

To run the application in the virtual device, run the following:

```shell
npm run android
```

#### Running on an Android device
To run on an actual device, first terminate any AVDs that are running. Connect the phone over USB and run `adb devices` to ensure that it shows up. You can then run `npm run start:android` to launch the application on the device.

The same software version restrictions apply to real devices.

#### Building an APK
To build a signed APK:

 1. Close all other development resources for the project.
 2. Run `npm run build:android` to first build the project.
 3. In Android Studio, choose _Build > Generate Signed APK_.
 4. Build a release APK by following the instructions in the GUI.

