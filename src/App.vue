<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { darkTheme } from 'naive-ui'
import header_ from './components/header.vue'
import intro_ from './components/intro.vue'
import content from './components/content.vue'
import footer_ from './components/footer.vue'

// modify theme vars
darkTheme.common.primaryColor = '#00a6ed'
darkTheme.common.primaryColorHover = '#468ad9'
darkTheme.common.primaryColorPressed = '#226cc1'
darkTheme.common.primaryColorSuppl = '#0e76ed'
darkTheme.common.successColor = '#14CC60'
darkTheme.common.warningColor = '#14CC60'
darkTheme.common.borderRadius = '7px'

</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-loading-bar-provider>
      <n-message-provider placement="top-right">
        <n-notification-provider placement="bottom-right">
          <n-layout>
            <n-layout-header bordered style="padding: 2rem;">
              <header_ />
            </n-layout-header>
            <n-layout-content style="padding: 2rem;">
              <intro_ />
              <content />
            </n-layout-content>
            <n-layout-footer bordered style="padding: 2rem;">
              <footer_ />
            </n-layout-footer>
          </n-layout>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped>
</style>
