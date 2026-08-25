<script setup>
import { useI18n } from 'vue-i18n'
import { useUser } from '@/ui/composables'
import BaseLayout from '@/ui/layouts/BaseLayout.vue'
import HelloWorld from '@/ui/components/HelloWorld.vue'

const { t } = useI18n()
const { user } = useUser()
</script>

<template>
  <BaseLayout>
    <HelloWorld :msg="`${t('general.hello')} ${user.name}`" class="mb-8" />

    <h3 class="mb-4 text-lg">
      {{ t('general.welcome') }}
      <span class="font-bold">template-clean-vite-vue3</span>
    </h3>

    <p class="mb-6">{{ t('auth.description') }} 🚀 ⚡️</p>

    <div class="flex items-center gap-4">
      <a href="https://dekalabs.com" target="_blank" rel="noopener">
        <img
          src="@/ui/assets/images/deka-logo.svg"
          alt="Dekalabs"
          class="h-6"
        />
      </a>

      <a
        href="https://github.com/sindresorhus/awesome"
        target="_blank"
        rel="noopener"
      >
        <img
          src="https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg"
          alt="Awesome"
          class="h-5"
        />
      </a>
    </div>
  </BaseLayout>
</template>
