# Cerby User Defaults (Take Home Challenge)

- [Cerby User Defaults (Take Home Challenge)](#cerby-user-defaults-take-home-challenge)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Install](#install)
- [Sample app](#sample-app)
  - [Normal mode](#normal-mode)
  - [Secure mode](#secure-mode)
  - [Clear](#clear)
- [Swift native module](#swift-native-module)
- [Design](#design)
- [LICENSE](#license)
- [Out of scope](#out-of-scope)

React native module written in Swift. Used to store a string to UserDefaults or Keychain.

Bootstrapped project using `npx create-expo-module` ([reference](https://docs.expo.dev/modules/get-started/#creating-a-new-module-with-an-example-project))


# Installation

## Requirements

* Ruby 2.7.6+
* Cocoapods
* Xcode 14.2+
* Node (tested with v18.16.0, but might work with v16.x)

## Install

First install the dependencies.

```sh
npm install
```

And the sample app dependencies too.
```sh
cd example/
npm install
```

To test the module, this project makes use of a sample app. You can find it in the `example/` directory.

Run it with
```sh
cd example
npm run ios
```

Runs the sample app with the UserDefaults module attached to it.

Alternatively, you can also run
```sh
npm run open:ios
```
in the root directory of the project to open the sample app in Xcode. In Xcode, run the app normally.

> 💡 **_NOTE:_** The app makes use of FaceID and TouchID. This can only be used with a real device, not a simulator. Use [this guide](https://github.com/expo/fyi/blob/main/setup-xcode-signing.md) to prepare your device. You need an Apple Developer account.

# Sample app

Preview:

![Screenshot of app](./images/screenshot1.png)

The sample app has a simple UX. It has two modes, normal and secure.

![app modes](./images/modes.png)

The text area has an autosave feature, which saves the text in it after 2 seconds. The data is saved in UserDefaults or the Keychain, depending on the mode.

## Normal mode

Saves data to UserDefaults.

## Secure mode

Saves data to the Keychain. Whenever autosave is triggered, the user is prompted with FaceID.

When the data is read from the Keychain it also asks for FaceID.

This mode also enables the lock button. With this button, a black screen blocks the text area so the text is not visible. To open the lock, you need to use FaceID. Note that after a value has been read from the keychain, the user is able to read this value again for X amount of time before FaceID asks for authorization again.

![Screenshot of locked text area](./images/lock1.png)

## Clear

The trash can button clears the current text in the text area and removes it from either UserDefaults or Keychain, depending on the current mode.

# Swift native module

The react native module is written in Swift. Find the code in the `src/` directory.

The Swift code is in `src/ios/`.

This module is in charge of saving to UserDefaults or Keychain, depending on the secure argument.

It uses Expo Module API. Specifically the [AsyncFunction](https://docs.expo.dev/modules/module-api/#asyncfunction) to make use of promises. This means that in the JS side of React Native `async/await` can be used.

# Design

Check the design of the app in [docs/design-process.md](docs/design-process.md)

# LICENSE
This project is licensed under the terms of the MIT license.

# Out of scope
* It isn't planned to make the module available through either Cocoapods or npm. Feel free to copy the codebase if it's helpful.
* No plans to support Android. This module only works for iOS.