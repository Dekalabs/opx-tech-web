<script setup>
import TheNavbar from './components/TheNavbar.vue'

defineProps({
  title: { type: String, default: '' },
})
</script>

<template>
  <TheNavbar />
  <main class="mx-4 mt-8">
    <h2 v-if="title" class="text-xl">{{ title }}</h2>
    <slot></slot>
  </main>
</template>
