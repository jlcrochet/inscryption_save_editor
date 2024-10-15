<template>
  <tabs>
    <tab title="Miscellaneous">
      <table cellpadding=4>
        <table-input
          v-model.number=saveFile.gbcData.currency
          label=Currency
          type=number min=0 max=999 required
        />
      </table>
    </tab>

    <tab title="Deck">
      <deck-editor :deck=saveFile.gbcData.deck />
    </tab>
  </tabs>
</template>

<script setup>
  const saveFile = inject('saveFile')
</script>
