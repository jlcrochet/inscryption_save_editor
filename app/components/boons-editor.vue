<template>
  <table>
    <template v-for="([name, description], i) in boonOptions">
      <table-input
        v-model=boonIds.$rcontent
        :value="i + 1"
        @change="boonIds.$rlength = boonIds.$rcontent.length"
        :label=name
        :help=description
        type=checkbox
      />
    </template>
  </table>
</template>

<script setup>
  import { boons as boonOptions } from '~/game-data'

  defineProps({
    boonIds: {
      type: Object,
      required: true
    }
  })
</script>
