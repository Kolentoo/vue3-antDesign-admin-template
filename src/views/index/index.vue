<template>
  <div class="index-container">首页 {{test}}</div>
</template>

<script setup>
  import { ref } from 'vue'
  let test = ref('首页测试123')
</script>
