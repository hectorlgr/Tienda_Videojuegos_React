import { useEffect, useState } from 'react'
import { getUserById } from '../services/userService'
import { getOrders } from '../services/orderService'
import { isRecordCollection } from '../utils/adminMetrics'
import { findUserOrders, toPublicUser } from '../utils/adminUsers'
import { assertNumericId } from '../utils/ids'

function initialDetail(userId) {
  try {
    assertNumericId(userId)
    return { userId, user: null, orders: null, loading: true, error: null, ordersError: false }
  } catch (error) {
    return { userId, user: null, orders: null, loading: false, error, ordersError: false }
  }
}

export function useAdminUserDetail(userId) {
  const [detail, setDetail] = useState(() => initialDetail(userId))

  // Al cambiar de ID, no se muestra el usuario ni el error de la consulta anterior.
  if (!Object.is(detail.userId, userId)) {
    setDetail(initialDetail(userId))
  }

  useEffect(() => {
    try {
      assertNumericId(userId)
    } catch {
      return
    }

    let active = true

    async function loadDetail() {
      // Las órdenes son secundarias: si fallan, el usuario se muestra igual.
      const [userOutcome, ordersOutcome] = await Promise.allSettled([getUserById(userId), getOrders()])
      if (!active) return

      const rawUser = userOutcome.status === 'fulfilled' ? userOutcome.value : null
      if (rawUser === null || typeof rawUser !== 'object' || Array.isArray(rawUser)) {
        const error = userOutcome.status === 'rejected'
          ? userOutcome.reason
          : new TypeError('Respuesta de usuario inválida.')
        setDetail({ userId, user: null, orders: null, loading: false, error, ordersError: false })
        return
      }

      const user = toPublicUser(rawUser)
      const ordersOk = ordersOutcome.status === 'fulfilled' && isRecordCollection(ordersOutcome.value)
      setDetail({
        userId,
        user,
        orders: ordersOk ? findUserOrders(user, ordersOutcome.value) : null,
        loading: false,
        error: null,
        ordersError: !ordersOk,
      })
    }

    loadDetail()
    return () => { active = false }
  }, [userId])

  const { user, orders, loading, error, ordersError } = detail
  return { user, orders, loading, error, ordersError }
}
