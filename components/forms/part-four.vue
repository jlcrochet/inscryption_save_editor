<template>
  <tab-list :titles="['Deck']">
    <template #0>
      <deck-editor :deck=saveFile.grimoraData.deck :game-data=gameData />
    </template>
  </tab-list>
</template>

<script>
  export default {
      props: {
          saveFile: {
              type: Object,
              required: true
          },
          gameData: {
              type: Object,
              required: true
          }
      }
  }
</script>
