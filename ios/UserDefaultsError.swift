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
