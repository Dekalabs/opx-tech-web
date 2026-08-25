<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <header>
    <div class="flex flex-col items-center p-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="iconify iconify--carbon"
        width="200"
        height="200"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 32 32"
      >
        <path
          d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12z"
          fill="currentColor"
        ></path>
        <path d="M11.5 11a2.5 2.5 0 1 0 2.5 2.5a2.5 2.5 0 0 0-2.5-2.5z" fill="currentColor"></path>
        <path d="M20.5 11a2.5 2.5 0 1 0 2.5 2.5a2.5 2.5 0 0 0-2.5-2.5z" fill="currentColor"></path>
        <path
          d="M16 19a8 8 0 0 0-6.85 3.89l1.71 1a6 6 0 0 1 10.28 0l1.71-1A8 8 0 0 0 16 19z"
          fill="currentColor"
        ></path>
      </svg>
      <h1 class="text-3xl font-bold leading-normal">404</h1>
      <h2 class="text-xl leading-normal">{{ t('errors.404') }}</h2>
    </div>
  </header>
</template>
