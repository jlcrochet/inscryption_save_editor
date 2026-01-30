<template>
  <div v-show=isActive>
    <slot />
  </div>
</template>

<script setup>
  const props = defineProps({
    title: {
      type: String,
      required: true
    }
  })

  const { tabs, tabIndex, register, unregister } = inject('tabs')
  const id = register({ title: props.title })

  const isActive = computed(() => tabIndex.value === id)

  onUnmounted(() => unregister(id))
</script>
