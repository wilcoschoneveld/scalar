<script setup lang="ts">
import { ROUTES } from '@/constants'
import { useRouter } from 'vue-router'

import SideHelp from './SideHelp.vue'
import SideNavLink from './SideNavLink.vue'

const { currentRoute } = useRouter()
</script>
<template>
  <nav
    aria-label="App Navigation"
    class="text-c-2 sm:w-13 flex sm:flex-col justify-center items-center px-2 py-2 scalar-sidenav relative drag-region bg-b-1"
    role="navigation">
    <ul class="flex sm:flex-col gap-1.5">
      <li
        v-for="({ icon, name, prettyName }, i) in ROUTES.filter(
          (route) => route.name !== 'settings',
        )"
        :key="i"
        class="no-drag-region">
        <SideNavLink
          :active="(currentRoute.name as string | undefined)?.startsWith(name)"
          :icon="icon"
          :name="name"
          :prettyName="prettyName">
          {{ name }}
        </SideNavLink>
      </li>
    </ul>
    <ul class="mt-auto flex sm:flex-col gap-1.5 py-0.5">
      <li class="flex items-center no-drag-region">
        <SideNavLink
          :active="currentRoute.name === 'settings'"
          icon="Settings"
          name="settings"
          prettyName="Settings">
          Settings
        </SideNavLink>
      </li>
      <li class="flex items-center no-drag-region">
        <SideHelp />
      </li>
    </ul>
  </nav>
</template>
<style scoped>
/** Make the sidebar draggable */
.drag-region {
  -webkit-app-region: drag;
}

/** Clickable items must not be draggable, though */
.no-drag-region {
  -webkit-app-region: no-drag;
}
</style>
