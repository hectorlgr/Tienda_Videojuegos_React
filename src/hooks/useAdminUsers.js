import { useEffect, useState } from 'react'
import { getUsers } from '../services/userService'
import { isRecordCollection } from '../utils/adminMetrics'
import { toPublicUser } from '../utils/adminUsers'

export function useAdminUsers() {
  const [result, setResult] = useState({ users: [], loading: true, error: null })

  useEffect(() => {
    let active = true

    async function loadUsers() {
      try {
        const users = await getUsers()
        if (!active) return
        if (!isRecordCollection(users)) throw new TypeError('Respuesta de usuarios inválida.')

        setResult({ users: users.map(toPublicUser), loading: false, error: null })
      } catch (error) {
        if (active) setResult({ users: [], loading: false, error })
      }
    }

    loadUsers()
    return () => { active = false }
  }, [])

  return result
}
