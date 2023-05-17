import ExpoModulesCore

public class CerbyUserDefaultsModule: Module {
  let userDefaultsKey = "myData"
  
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('CerbyUserDefaults')` in JavaScript.
    Name("CerbyUserDefaults")
    
    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! 👋 😇"
    }
    
    AsyncFunction("saveData") { (value: String, promise: Promise) in
      UserDefaults.standard.set(value, forKey: userDefaultsKey)
      promise.resolve("success")
    }
    
    AsyncFunction("getData") { (promise: Promise) in
      let data = UserDefaults.standard.string(forKey: userDefaultsKey)
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
  case unexpected(code: Int)
}

extension UserDefaultsError: CustomStringConvertible {
  var description: String {
    switch self {
    case .noData:
      return "No data found."
    case .unexpected(_):
      return "Unexpected error."
    }
  }
}
