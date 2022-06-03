import { ConnectState } from './models/connect'
import { UserRole } from './utils/constants'

export default function(initialState: Partial<ConnectState>) {
  const { user } = initialState
  return {
    // Only admin use account function
    canReadAccount: user?.currentUser?.role === UserRole.ADMIN,
    canLinkToOdoo: user?.currentUser?.role === UserRole.OPERATOR,
  }
}
