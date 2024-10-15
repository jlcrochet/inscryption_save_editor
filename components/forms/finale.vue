<template>
  <tabs>
    <tab title="Deck">
      <deck-editor :deck=saveFile.grimoraData.deck />
    </tab>
  </tabs>
</template>

<script setup>
  const saveFile = inject('saveFile')
</script>
