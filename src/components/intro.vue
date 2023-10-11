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
          You've got the answer to the equation above, right?
        </n-text>
      </n-h1>
      <n-h4>
        <n-text depth="3">
          Lets see how can you prove you know the answer using a <n-gradient-text type="info"><b>zero knowledge proof</b></n-gradient-text>.
          And in the mean time try to understand a thing or two about what is happening.
        </n-text>
      </n-h4>
      <n-alert title="Developer console" type="info" :bordered="true">
        Open dev console to inspect additional logs going through the example.
      </n-alert>
    </n-space>
  </div>
  <br><br><n-divider /><br><br>
</template>

<style scoped>

</style>
