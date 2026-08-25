<script setup>
import { useI18n } from 'vue-i18n'
import { useUser } from '@/ui/composables'
import BaseLayout from '@/ui/layouts/BaseLayout.vue'
import HelloWorld from '@/ui/components/HelloWorld.vue'

const { t } = useI18n()
const { name } = useUser()
</script>

<template>
  <BaseLayout :title="t('controlPanel.title')">
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
        d="M4 20v2h4.586L2 28.586L3.414 30L10 23.414V28h2v-8H4z"
        fill="currentColor"
      ></path>
      <path d="M24 21h2v5h-2z" fill="currentColor"></path>
      <path d="M20 16h2v10h-2z" fill="currentColor"></path>
      <path d="M16 18h2v8h-2z" fill="currentColor"></path>
      <path
        d="M28 2H4a2.002 2.002 0 0 0-2 2v12h2v-3h24.001l.001 15H16v2h12a2.003 2.003 0 0 0 2-2V4a2.002 2.002 0 0 0-2-2zm-16 9H4V4h8zm2 0V4h14v7z"
        fill="currentColor"
      ></path>
    </svg>
    <HelloWorld :msg="name" />
  </BaseLayout>
</template>
