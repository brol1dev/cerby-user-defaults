import ExpoModulesCore
import LocalAuthentication

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
        // Create an access control instance that dictates how the item can be read later.
        let access = SecAccessControlCreateWithFlags(nil, // Use the default allocator.
                                                     kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly,
                                                     .userPresence,
                                                     nil) // Ignore any error.
        
        // Allow a device unlock in the last 10 seconds to be used to get at keychain items.
        let context = LAContext()
        context.touchIDAuthenticationAllowableReuseDuration = 10
        
        guard let data = value.data(using: String.Encoding.utf8) else {
          promise.reject(UserDefaultsError.unauthorized)
          return
        }
        // Build the query for use in the add operation.
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                    kSecAttrAccount as String: Keys.userDefaultsKey,
                                    kSecAttrAccessControl as String: access as Any,
                                    kSecUseAuthenticationContext as String: context,
                                    kSecValueData as String: data]
        
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
          print("save failed, status: \(status)")
          promise.reject(UserDefaultsError.unauthorized)
          return
        }
        print("saved, status: \(status)")
        promise.resolve("success")
        //        if keychain.set(value, forKey: Keys.userDefaultsKey, withAccess: .accessibleWhenPasscodeSetThisDeviceOnly) {
        //          promise.resolve("success")
        //        } else {
        //          promise.reject(UserDefaultsError.unauthorized)
        //        }
        return
      }
      
      UserDefaults.standard.set(value, forKey: Keys.userDefaultsKey)
      promise.resolve("success")
      
    }
    
    AsyncFunction("getData") { (secure: Bool, promise: Promise) in
      print("retrieving value. Secure mode: \(secure)")
      if secure {
        let context = LAContext()
        context.localizedReason = "Access your data on the keychain"
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                    kSecMatchLimit as String: kSecMatchLimitOne,
                                    kSecReturnAttributes as String: true,
                                    kSecUseAuthenticationContext as String: context,
                                    kSecReturnData as String: true]
        
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        print("status: \(status)")
        guard status == errSecSuccess else { promise.reject(UserDefaultsError.noData)
          return
        }
        
        guard let existingItem = item as? [String: Any],
              let value = existingItem[kSecValueData as String] as? String
        else {
          promise.reject(UserDefaultsError.noData)
          return
        }
        print("getData value: \(value)")
        promise.resolve(value)
        
        //        let data = keychain.get(Keys.userDefaultsKey)
        //        if let data = data {
        //          promise.resolve(data)
        //        } else {
        //          promise.reject(UserDefaultsError.noData)
        //        }
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
