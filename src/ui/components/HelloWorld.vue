<script setup>
defineProps({
  msg: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <h2 class="text-2xl">{{ msg }} 👋</h2>
</template>
