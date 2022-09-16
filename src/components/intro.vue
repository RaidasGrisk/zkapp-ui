<script setup>
import { ref } from 'vue'

</script>

<template>
  <br><br>
  <div style="max-width: 600px;">
    <n-space vertical>
      <n-tag :size="'large'" style="padding: 50px;" :bordered="false" round>
        <n-text type="tertiary" :strong="true" depth="3" style="font-size: 40px">
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
        <n-text type="info">
          Lets see how can you prove you know the answer using a <n-text type="primary"><b>zero knowledge proof</b></n-text>.
          And in the mean time try to understand a thing or two about what is happening.
        </n-text>
      </n-h4>
    </n-space>
  </div>
  <br><br><n-divider /><br><br>
</template>

<style scoped>

</style>
