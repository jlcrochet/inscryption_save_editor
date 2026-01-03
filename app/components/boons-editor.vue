<template>
  <table>
    <template v-for="(boon, i) in boons">
      <table-input
        v-model=boonIds.$rcontent
        :value="i + 1"
        @change="boonIds.$rlength = boonIds.$rcontent.length"
        :label=boon.name
        :help=boon.description
        type=checkbox
      />
    </template>
  </table>
</template>

<script setup>
  defineProps({
    boonIds: {
      type: Object,
      required: true
    }
  })
</script>
