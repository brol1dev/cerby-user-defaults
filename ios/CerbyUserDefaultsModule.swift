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
        if !saveToKeychain(value) {
          promise.reject(UserDefaultsError.keychainSaveFailed)
          return
        }
        
        promise.resolve("success")
        return
      }
      
      UserDefaults.standard.set(value, forKey: Keys.userDefaultsKey)
      promise.resolve("success")
    }
    
    AsyncFunction("getData") { (secure: Bool, promise: Promise) in
      print("retrieving value. Secure mode: \(secure)")
      if secure {
        guard let value = getFromKeychain() else {
          promise.reject(UserDefaultsError.noData)
          return
        }
        promise.resolve(value)
        return
      }
      
      guard let data = UserDefaults.standard.string(forKey: Keys.userDefaultsKey) else {
        promise.reject(UserDefaultsError.noData)
        return
      }
      promise.resolve(data)
    }
    
    AsyncFunction("clear") { (secure: Bool, promise: Promise) in
      print("Clear value. Secure mode: \(secure)")
      if secure {
        let query: [String: Any] = [
          kSecClass as String: kSecClassGenericPassword,
          kSecAttrAccount as String: Keys.userDefaultsKey,
        ]
        
        SecItemDelete(query as CFDictionary)
        promise.resolve("success")
        return
      }
      
      UserDefaults.standard.removeObject(forKey: Keys.userDefaultsKey)
      promise.resolve("success")
    }
  }
  
  func saveToKeychain(_ value: String) -> Bool {
    // Create an access control instance that dictates how the item can be read later.
    let access = SecAccessControlCreateWithFlags(nil, // Use the default allocator.
                                                 kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly,
                                                 .userPresence,
                                                 nil) // Ignore any error.
    
    guard let data = value.data(using: String.Encoding.utf8) else {
      print("Save failed. Data could not be created.")
      return false
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
      print("Updating value: \(value)")
      
      status = SecItemUpdate(query as CFDictionary, attributesToUpdate)
    }
    
    guard status == errSecSuccess else {
      print("Save failed, status: \(status)")
      return false
    }
    
    return true
  }
  
  func getFromKeychain() -> String? {
    let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                kSecAttrAccount as String: Keys.userDefaultsKey,
                                kSecMatchLimit as String: kSecMatchLimitOne,
                                kSecReturnAttributes as String: true,
                                kSecUseAuthenticationContext as String: context,
                                kSecReturnData as String: true]
    
    var item: CFTypeRef?
    let status = SecItemCopyMatching(query as CFDictionary, &item)
    guard status == errSecSuccess else {
      print("Failed to read from keychain, status: \(status)")
      return nil
    }
    
    guard let existingItem = item as? [String: Any],
          let valueData = existingItem[kSecValueData as String] as? Data,
          let value = String(data: valueData, encoding: String.Encoding.utf8)
    else {
      print("Failed to get parse the value from keychain.")
      return nil
    }
    
    return value
  }
}
