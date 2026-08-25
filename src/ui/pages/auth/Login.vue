<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import login from '@/application/auth/login'

const { t } = useI18n()
const router = useRouter()

const name = ref('')

const doLogin = () => {
  login(
    {
      token: name.value,
    },
    {
      onSuccess: () => {
        router.push({ name: 'home' })
      },
      onError: console.error,
    },
  )
}
</script>

<template>
  <h1 class="text-2xl">
    <a
      href="https://github.com/Dekalabs/template-clean-vite-vue3"
      target="_blank"
    >
      template-clean-vite-vue3
    </a>
  </h1>
  <p>
    <em class="text-sm opacity-75">{{ t('auth.description') }} 🚀 ⚡️</em>
  </p>

  <div class="py-4" />

  <input
    id="name"
    v-model="name"
    :placeholder="t('auth.name')"
    :aria-label="t('auth.name')"
    type="text"
    autocomplete="false"
    class="w-250 border-rounded active:none border border-gray-200 bg-transparent px-4 py-2 text-center outline-none dark:border-gray-700"
    @keydown.enter="doLogin"
  />
  <label class="hidden" for="name">{{ t('auth.name') }}</label>

  <div>
    <button
      class="m-3 inline-block cursor-pointer rounded bg-teal-600 px-4 py-1 text-sm leading-relaxed text-white hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50"
      :disabled="!name"
      @click="doLogin"
    >
      {{ t('auth.login') }}
    </button>
  </div>
</template>
