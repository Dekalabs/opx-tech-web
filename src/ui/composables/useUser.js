import User from '@/domain/User'

import { useState } from './useState'

const [user, setUser] = useState(new User())

export function useUser() {
  const isNotAuthenticated = () => user.value.id === undefined
  const isAuthenticated = () => !!user.value.id

  const cleanUser = () => setUser(new User())

  const cleanApp = () => {
    cleanUser()
  }

  return { user, setUser, isNotAuthenticated, isAuthenticated, cleanApp }
}
