<script setup>
import { ref } from 'vue'

</script>

<template>
  <br><br>
  <div style="max-width: 600px;">
    <n-space vertical>
      <n-tag :size="'large'" style="padding: 30px;" :bordered="false" round>
        <n-text type="tertiary" :strong="true" depth="3" style="font-size: 25px">
          10 / 2 + 2 = ?
        </n-text>
      </n-tag>
      <br>
      <n-h1>
        <n-text type="primary">
          Do you have the solution for the equation above?
        </n-text>
      </n-h1>
      <n-h4>
        <n-text depth="3">
          Let's explore how can show you've got the answer with a <n-gradient-text type="info"><b>zero knowledge proof</b></n-gradient-text>.
          While you're at it, try to grasp what's going on.
        </n-text>
      </n-h4>
      <n-alert title="Developer console" type="info" :bordered="true">
        You can open dev console to inspect additional logs going through the example.
      </n-alert>
    </n-space>
  </div>
  <br><br><n-divider /><br><br>
</template>

<style scoped>

</style>
