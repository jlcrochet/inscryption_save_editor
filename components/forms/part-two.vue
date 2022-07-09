<template>
  <tab-list :titles="['Miscellaneous', 'Deck']">
    <template #0>
      <table cellpadding=2>
        <tr>
          <td>Currency:</td>
          <td><input type=number v-model.lazy.number=saveFile.gbcData.currency min=0 max=999 required /></td>
        </tr>
      </table>
    </template>

    <template #1>
      <deck-editor :deck=saveFile.gbcData.deck :game-data=gameData />
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
