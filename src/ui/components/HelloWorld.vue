<script setup>
defineProps({
  msg: { type: String, default: '' },
})
</script>

<template>
  <h2>Hello {{ msg }} 👋</h2>
</template>
