import peopleAPI from '@/infrastructure/api/peopleAPI'

export default async ({ onSuccess, onError }) => {
  try {
    const people = await peopleAPI.list()
    onSuccess(people)
  } catch (error) {
    onError(error)
  }
}
