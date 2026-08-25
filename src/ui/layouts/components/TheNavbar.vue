<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUser } from '@/ui/composables'
import logout from '@/application/auth/logout'

const { t } = useI18n()
const router = useRouter()
const showOptions = ref(false)
const { name } = useUser()

const doLogout = () => {
  logout({
    onSuccess: () => {
      router.push({ name: 'login' })
    },
    onError: console.error,
  })
}
</script>

<template>
  <header>
    <h1 class="text-2xl">
      {{ t('general.welcome') }} template-clean-vite-vue3 ✌️
    </h1>

    <nav>
      <RouterLink :to="{ name: 'home' }">{{
        t('controlPanel.menu')
      }}</RouterLink>
      <RouterLink :to="{ name: 'statistics' }">{{
        t('statistics.menu')
      }}</RouterLink>

      <div class="relative ml-2 inline-block text-left">
        <div>
          <button
            id="menu-button"
            type="button"
            class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            aria-expanded="true"
            aria-haspopup="true"
            @click="showOptions = !showOptions"
          >
            {{ name }}
            <svg
              class="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          v-if="showOptions"
          class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div class="py-1" role="none">
            <button
              type="submit"
              class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              tabindex="-1"
              @click="doLogout"
            >
              {{ t('auth.logout') }}
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 1rem;
  margin-top: 1rem;

  & a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);

    &:first-child {
      border: 0;
      padding-left: 0;
    }
  }

  & a.router-link-exact-active {
    color: var(--color-text);

    &:hover {
      background-color: transparent;
    }
  }
}
</style>
