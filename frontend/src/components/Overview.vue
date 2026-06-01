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
