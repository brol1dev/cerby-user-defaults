import ExpoModulesCore

struct Keys {
  static let userDefaultsKey = "myData"
}

public class CerbyUserDefaultsModule: Module {
  let keychain = KeychainSwift()
  
  public func definition() -> ModuleDefinition {
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
    
    AsyncFunction("clear") { (promise: Promise) in
      print("clear")
      keychain.clear()
      UserDefaults.standard.removeObject(forKey: Keys.userDefaultsKey)
      promise.resolve("success")
    }
  }
}
