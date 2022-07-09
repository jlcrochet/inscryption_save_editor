<template>
  <table cellpadding=2>
    <tr>
      <td>Random seed:</td>
      <td><input type=number v-model.lazy.number=saveFile.randomSeed required /></td>
    </tr>

    <tr>
      <td>Play time:</td>
      <td><input type=number v-model.lazy.number=saveFile.playTime min=0 step=any required /></td>
    </tr>

    <tr>
      <td><span title="This counter applies to the Ouroboros in Parts One and Two as well as the Ourobot in Part Three. Kaycee's Mod has its own counter for Ouroboros deaths that resets after each run.">Ouroboros deaths</span>:</td>
      <td><input type=number v-model.lazy.number=saveFile.ouroborosDeaths min=0 required /></td>
    </tr>

    <tr>
      <td><span title="If true, the game boots into the Kaycee's Mod menu on startup.">Kaycee's mod active</span>:</td>
      <td><input type=checkbox v-model=saveFile.ascensionActive /></td>
    </tr>
  </table>
</template>

<script>
  export default {
      props: {
          saveFile: {
              type: Object,
              required: true
          }
      }
  }
</script>
