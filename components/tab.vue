<template>
  <slot />
</template>

<script setup>
  defineProps({
      title: {
          type: String,
          required: true
      }
  })
</script>
