# Cerby User Defaults (Take Home Challenge)

React native module written in Swift. Used to store a string to UserDefaults or Keychain.

Bootstrapped project using `npx create-expo-module` ([reference](https://docs.expo.dev/modules/get-started/#creating-a-new-module-with-an-example-project))

# Installation

## Requirements

* Ruby 2.7.6+
* Cocoapods
* Xcode 14.2+
* Node (tested with v18.16.0, but might work with v16.x)

# Install

To test the module, this project makes use of an sample app. You can find it in the `example/` directory.

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
in the root directory of the project to Open the sample app in Xcode. In Xcode, run the app normally.

> 💡 **_NOTE:_** The app makes use of FaceID and TouchID. This can only be used with a real device, not a simulator. Use [this guide](https://github.com/expo/fyi/blob/main/setup-xcode-signing.md) to prepare your device. You need an Apple Developer account.

## Sample app

Preview:

![Screenshot of app](./images/screenshot1.png)

The sample app has a simple UX. It has two modes, normal and secure.

![app modes](./images/modes.png)

The text area has an autosave feature, which saves the text in it after 2 seconds. The data is saved in UserDefaults or the Keychain, depending on the mode.

### Normal mode

Saves data to UserDefaults.

### Secure mode

Saves data to the Keychain. Whenever autosave is triggered, the user is prompted with FaceID.

When the data is read from the Keychain it also asks for FaceID.

This mode also enables the lock button. With this button, a black screen blocks the text area so the text is not visible. To open the lock, you need to use FaceID. Note that after a value has been read from the keychain, the user is able to read this value again for X amount of time before FaceID asks for authorization again.

![Screenshot of locked text area](./images/lock1.png)

## Clear

The trash can button clears the current text in the text area and removes it from either UserDefaults or Keychain, depending on the current mode.