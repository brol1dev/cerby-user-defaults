import ExpoModulesCore
import LocalAuthentication

struct Keys {
  static let keychainIdentifier = "cerby"
  static let userDefaultsKey = "myData"
}

public class CerbyUserDefaultsModule: Module {
  lazy var context: LAContext = {
    let context = LAContext()
    context.touchIDAuthenticationAllowableReuseDuration = 10
    return context
  }()
  
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
        
        var status = SecItemAdd(query as CFDictionary, nil)
        
        if status == errSecDuplicateItem {
          // Item already exist, thus update it.
          let query: [String: Any] = [
            kSecAttrAccount as String: Keys.userDefaultsKey,
            kSecClass as String: kSecClassGenericPassword,
          ]
          
          let attributesToUpdate = [kSecValueData: data] as CFDictionary
          print("updating value: \(value)")
          
          // Update existing item
          status = SecItemUpdate(query as CFDictionary, attributesToUpdate)
        }
        
        guard status == errSecSuccess else {
          print("save failed, status: \(status)")
          promise.reject(UserDefaultsError.unauthorized)
          return
        }
        
        print("saved, status: \(status)")
        promise.resolve("success")
        return
      }
      
      UserDefaults.standard.set(value, forKey: Keys.userDefaultsKey)
      promise.resolve("success")
    }
    
    AsyncFunction("getData") { (secure: Bool, promise: Promise) in
      print("retrieving value. Secure mode: \(secure)")
      if secure {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                    kSecAttrAccount as String: Keys.userDefaultsKey,
                                    kSecMatchLimit as String: kSecMatchLimitOne,
                                    kSecReturnAttributes as String: true,
                                    kSecUseAuthenticationContext as String: context,
                                    kSecReturnData as String: true]
        
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        print("keychain read status: \(status)")
        guard status == errSecSuccess else {
          promise.reject(UserDefaultsError.noData)
          return
        }
        
        guard let existingItem = item as? [String: Any],
              let valueData = existingItem[kSecValueData as String] as? Data,
              let value = String(data: valueData, encoding: String.Encoding.utf8)
        else {
          print("keychain read failed")
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
      UserDefaults.standard.removeObject(forKey: Keys.userDefaultsKey)
      promise.resolve("success")
    }
  }
}
