# Design ideas

## MacOS Big Sur fail

MacOS Big Sur (v11.7.x) cannot run React native 0.71. Specifically, it cannot compile iOS native modules.

I tested
* [create-expo-module](https://docs.expo.dev/modules/native-module-tutorial/)
* [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
* [Manually creating the module](https://reactnative.dev/docs/native-modules-ios)

None of the options works. It seems that the latest version of react native needs a newer version of Swift only available in at least Xcode 4.2.

## iOS Native module alternatives

With the testing done in Big Sur, I found out I could use three general alternatives to create an iOS native module.

* create-expo-module
* create-react-native-library
* Manually creating the module

I found Expo to be very easy for development and decided to move forward with it.

## UserDefaults and Keychain

The module needs to save and read a string from UserDefaults or the keychain. Depending on a flag passed as an argument.

Both UserDefaults and Keychain need a key to save and read data. Since the purpose of the module is to be used by a sample app only as an excersice, I decided to use the same constant key for both models. This can be opened to let the user pass the key as well.

UserDefaults implementation is straightforward since it is not secure.

Keychain requirement is more complex. The exercise requires biometrics authentication to authorize the user to save or read data. Apple has an example about it in [this link](https://developer.apple.com/documentation/localauthentication/accessing_keychain_items_with_face_id_or_touch_id).

The idea is that Keychain will make use of the LocalAuthorization framework when saving or reading data, which shows the user the FaceID prompt.

### Caveats

* I need to fully understand the API, because currently the FaceID prompt is being called everytime the data is saved. This might be by design but need to explore if there's an alternative.
* However, when reading a value, it waits X amount of seconds until it asks for FaceID again. But it isn't respecting the value set in [touchIDAuthenticationAllowableReuseDuration](https://developer.apple.com/documentation/localauthentication/lacontext/1622329-touchidauthenticationallowablere).

## Sample app
Took the design of the sample app from the mock of the exercise. Made it very simple and it is writting in Typescript.

It makes use of the module and saves text in a TextInput in either UserDefaults or Keychain. There is a button to change from normal to secure mode.
