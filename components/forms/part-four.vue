<template>
  <tabs>
    <tab title="Deck">
      <deck-editor :deck=saveFile.grimoraData.deck :game-data=gameData />
    </tab>
  </tabs>
</template>

<script setup>
  defineProps({
      saveFile: {
          type: Object,
          required: true
      },
      gameData: {
          type: Object,
          required: true
      }
  })
</script>
