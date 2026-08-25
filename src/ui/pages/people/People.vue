<script setup>
import { onMounted, ref } from 'vue'

import getPeopleUseCase from '@/application/people/getPeopleUseCase'
import BaseLayout from '@/ui/layouts/BaseLayout.vue'

const people = ref([])

onMounted(async () => {
  await getPeopleUseCase({
    onSuccess: peopleData => {
      people.value = peopleData
    },
    onError: console.error,
  })
})
</script>

<template>
  <BaseLayout>
    <pre>{{ people }}</pre>
  </BaseLayout>
</template>
