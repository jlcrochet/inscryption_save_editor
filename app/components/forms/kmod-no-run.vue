<template>
  <tabs>
    <tab title="Miscellaneous">
      <table>
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
      <table>
        <tr v-for="(deck, i) in starterDecks" :key="i">
          <td>
            <label :for="'deck-' + i">{{ deck }}</label>
          </td>
          <td>
            <input
              :id="'deck-' + i"
              type="checkbox"
              :checked="saveFile.ascensionData.conqueredStarterDecks.$rcontent.includes(deck)"
              @change="toggleConqueredDeck(deck, $event.target.checked)"
            />
          </td>
        </tr>
      </table>
    </tab>
  </tabs>
</template>

<script setup>
  import { useConqueredDecks } from '~/composables/useConqueredDecks'

  const saveFile = inject('saveFile')
  const { toggleConqueredDeck } = useConqueredDecks(saveFile)
</script>
