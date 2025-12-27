<template>
  <table>
    <table-input
      v-model.number=saveFile.randomSeed
      label='Random seed'
      type=number required
    />
    <table-input
      v-model.number=saveFile.playTime
      label='Play time'
      type=number min=0 step=any required
    />
    <table-input
      v-model.number=saveFile.ouroborosDeaths
      label='Ouroboros deaths'
      help="This counter applies to the Ouroboros in Parts One and Two as well as the Ourobot in Part Three. Kaycee's Mod has its own counter for Ouroboros deaths that resets after each run."
      type=number min=0 required
    />
    <table-input
      v-model=saveFile.ascensionActive
      label="Kaycee's Mod active"
      help="If true, the game boots into the Kaycee's Mod menu on startup."
      type=checkbox
    />
  </table>
</template>

<script setup>
  const saveFile = inject('saveFile')
</script>
