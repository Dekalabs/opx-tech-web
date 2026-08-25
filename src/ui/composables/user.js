import { ref } from 'vue'
import getUser from '@/application/user/getUser'

export function useUser() {
  const name = ref('')

  const cleanName = () => (name.value = '')

  getUser({
    onSuccess: user => {
      name.value = user
    },
    onError: console.error,
  })

  return { name, cleanName }
}
