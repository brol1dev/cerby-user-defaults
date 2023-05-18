enum UserDefaultsError : Error {
  case noData
  case keychainSaveFailed
  case unexpected(code: Int)
}

extension UserDefaultsError: CustomStringConvertible {
  var description: String {
    switch self {
    case .noData:
      return "No data found."
    case .keychainSaveFailed:
      return "Failed to save data to keychain."
    case .unexpected(_):
      return "Unexpected error."
    }
  }
}
