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
      <deck-editor :deck=saveFile.gbcData.deck />
    </tab>
  </tabs>
</template>

<script setup>
  const saveFile = useState('saveFile')
  const gameData = useState('gameData')
</script>
