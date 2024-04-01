<template>
  <tabs>
    <tab title="Miscellaneous">
      <table cellpadding=4>
        <table-input
          v-model.number=saveFile.ascensionData.challengeLevel
          label='Challenge level'
          type=number min=0 required
        />
        <table-input
          v-model.number=saveFile.ascensionData.numRunsSinceReachedFirstBoss
          label='Runs since first boss was reached'
          help="If 0, your deck will start with two Rabbit Pelts; if 1, your deck will start with an Opossum and a Rabbit Pelt; else, your deck will start with an Opossum and a Ring Worm."
          type=number min=0 required
        />
      </table>
    </tab>

    <tab title="Conquered Starter Decks">
      <table cellpadding=4>
        <template v-for="deck in starterDecks">
          <table-input
            v-model=saveFile.ascensionData.conqueredStarterDecks.$rcontent
            :value=deck
            @change="saveFile.ascensionData.conqueredStarterDecks.$rlength = saveFile.ascensionData.conqueredStarterDecks.$rcontent.length"
            :label=deck
            type=checkbox
          />
        </template>
      </table>
    </tab>
  </tabs>
</template>

<script setup>
  import { starterDecks } from '~/game-data'

  const saveFile = useState('saveFile')
</script>
