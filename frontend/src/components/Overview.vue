<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <div class="overview-card">
    <div class="overview-header">
      <span class="icon">📝</span>
      <span class="title">天気概況</span>
    </div>

    <p class="overview-text">
      {{ text }}
    </p>
  </div>
</template>

<style scoped>
.overview-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-top: 20px;
  position: relative;
  line-height: 1.2;
  text-align: start;
  white-space: pre-line;
  width: 760px;
  opacity: 0;
  animation: fadeUp 1s ease 1s forwards;
}

.overview-card::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 20px;
  border: 10px solid transparent;
  border-top-color: #fff;
}

.overview-header {
  margin-bottom: 16px;
}

.title {
  font-weight: bold;
}

.overview-card p {
  font-size: 14px;
}
</style>
