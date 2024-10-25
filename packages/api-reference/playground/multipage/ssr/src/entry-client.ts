// TODO: Remove CSS imports eventually
import '@scalar/components/style.css'
import '@scalar/themes/style.css'

import { createApp } from './main'

const { app, router } = createApp()

// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
  app.mount('#app')

  console.log('hydrated')
})