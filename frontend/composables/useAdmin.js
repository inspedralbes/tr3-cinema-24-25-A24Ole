import { useState } from '#app'

export const useAdmin = () => {
  const isAdmin = useState('isAdmin', () => false)

  const toggleAdmin = () => {
    isAdmin.value = !isAdmin.value
  }

  return {
    isAdmin,
    toggleAdmin
  }
}
