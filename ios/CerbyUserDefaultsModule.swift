import ExpoModulesCore

struct Keys {
  static let userDefaultsKey = "myData"
}

public class CerbyUserDefaultsModule: Module {
  let keychain = KeychainSwift()
  
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('CerbyUserDefaults')` in JavaScript.
    Name("CerbyUserDefaults")
    
    AsyncFunction("saveData") { (value: String, secure: Bool, promise: Promise) in
      print("saving value: '\(value)'. Secure mode: \(secure)")
      if secure {
        if keychain.set(value, forKey: Keys.userDefaultsKey, withAccess: .accessibleWhenPasscodeSetThisDeviceOnly) {
          promise.resolve("success")
        } else {
          promise.reject(UserDefaultsError.unauthorized)
        }
        return
      }
      
      UserDefaults.standard.set(value, forKey: Keys.userDefaultsKey)
      promise.resolve("success")
      
    }
    
    AsyncFunction("getData") { (secure: Bool, promise: Promise) in
      print("retrieving value. Secure mode: \(secure)")
      if secure {
        let data = keychain.get(Keys.userDefaultsKey)
        if let data = data {
          promise.resolve(data)
        } else {
          promise.reject(UserDefaultsError.noData)
        }
        return
      }
      
      let data = UserDefaults.standard.string(forKey: Keys.userDefaultsKey)
      if let data = data {
        promise.resolve(data)
      } else {
        promise.reject(UserDefaultsError.noData)
      }
    }
  }
}

enum UserDefaultsError : Error {
  case noData
  case unauthorized
  case unexpected(code: Int)
}

extension UserDefaultsError: CustomStringConvertible {
  var description: String {
    switch self {
    case .noData:
      return "No data found."
    case .unauthorized:
      return "Not authorized for this operation."
    case .unexpected(_):
      return "Unexpected error."
    }
  }
}
