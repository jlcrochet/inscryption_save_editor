<template>
  <tabs>
    <tab title="Miscellaneous">
      <table cellpadding=2>
        <tr>
          <td>Currency:</td>
          <td><input type=number v-model.lazy.number=saveFile.gbcData.currency min=0 max=999 required /></td>
        </tr>
      </table>
    </tab>

    <tab title="Deck">
      <deck-editor :deck=saveFile.gbcData.deck :game-data=gameData />
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
