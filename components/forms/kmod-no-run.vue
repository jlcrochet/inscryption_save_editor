<template>
  <tabs>
    <tab title="Miscellaneous">
      <table cellpadding=2>
        <tr>
          <td>Challenge level:</td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.challengeLevel min=0 required /></td>
        </tr>

        <tr>
          <td><span title="If 0, your deck will start with two Rabbit Pelts; if 1, your deck will start with an Opossum and a Rabbit Pelt; else, your deck will start with an Opossum and a Ring Worm.">Runs since first boss was reached</span>:</td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.numRunsSinceReachedFirstBoss min=0 required /></td>
        </tr>
      </table>
    </tab>

    <tab title="Conquered Starter Decks">
      <table cellpadding=2>
        <template v-for="deck in gameData.starterDecks">
          <tr>
            <td>{{ deck }}</td>
            <td>
              <input type=checkbox
                     :value=deck
                     v-model=saveFile.ascensionData.conqueredStarterDecks.$rcontent
                     @change="savefile.ascensionData.conqueredStarterDecks.$rlength = savefile.ascensionData.conqueredStarterDecks.$rcontent.length" />
            </td>
          </tr>
        </template>
      </table>
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
