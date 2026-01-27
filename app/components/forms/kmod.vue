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
          v-model.number=saveFile.ascensionData.currentRunSeed
          label='Run seed'
          type=number required
        />
        <table-input
          v-model.number=saveFile.ascensionData.currentOuroborosDeaths
          label='Ouroboros deaths'
          type=number min=0 required
        />
        <table-input
          v-model.number=saveFile.ascensionData.numRunsSinceReachedFirstBoss
          label='Runs since first boss was reached'
          help="If 0, your deck will start with two Rabbit Pelts; if 1, your deck will start with an Opossum and a Rabbit Pelt; else, your deck will start with an Opossum and a Ring Worm."
          type=number min=0 required
        />
        <table-input
          v-model.number=saveFile.ascensionData.currentRun.currency
          label=Currency
          type=number min=0 max=999 required
        />
        <table-input
          v-model.number=saveFile.ascensionData.currentRun.playerLives
          label=Lives
          type=number min=0 required
        />
        <table-input
          v-model.number=saveFile.ascensionData.currentRun.maxPlayerLives
          label='Maximum lives'
          type=number min=0 required
        />

        <table-select
          v-model.number=saveFile.ascensionData.currentRun.eyeState
          label='Eye state'
          required
        >
          <template v-for="(state, i) in eyeStates">
            <option :value=i>{{ state }}</option>
          </template>
        </table-select>

        <table-input
          v-model=saveFile.ascensionData.currentRun.bonelordPuzzleActive
          label='Bonelord puzzle active'
          help="If true, the eyes on the Bonelord's skull mounted on the wall will turn red; triggered in-game by clicking on the skull several times."
          type=checkbox
        />
        <table-input
          v-model=saveFile.ascensionData.currentRun.survivorsDead
          label='Survivors dead'
          help="Whether or not the campfire survivors have been killed."
          type=checkbox
        />
        <table-input
          v-model=saveFile.ascensionData.currentRun.trapperKnifeBought
          label='Skinning Knife bought'
          help="Whether or not the Skinning Knife has been purchased from the Trapper."
          type=checkbox
        />
      </table>
    </tab>

    <tab title="Deck">
      <deck-editor :deck=saveFile.ascensionData.currentRun.playerDeck />
    </tab>

    <tab title="Items">
      <items-editor :itemList=saveFile.ascensionData.currentRun.consumables />
    </tab>

    <tab title="Totems">
      <totems-editor
        :totemTops=saveFile.ascensionData.currentRun.totemTops
        :totemBottoms=saveFile.ascensionData.currentRun.totemBottoms
        :totems=saveFile.ascensionData.currentRun.totems
      />
    </tab>

    <tab title="Boons">
      <boons-editor :boonIds=saveFile.ascensionData.currentRun.playerDeck.boonIds />
    </tab>

    <tab title="Painting Puzzle">
      <painting-puzzle-editor :oilPaintingState=saveFile.ascensionData.oilPaintingState />
    </tab>

    <tab title="Maps">
      <table>
        <table-input
          v-model.number=saveFile.ascensionData.currentRun.regionTier
          label='Current map'
          help="Zero-based index for the current map; 0 for Map #1, 1 for Map #2, etc."
          type=number min=0 max=2 required
        />

        <template v-for="i in saveFile.ascensionData.currentRun.regionOrder.$plength">
          <table-select
            v-model.number='saveFile.ascensionData.currentRun.regionOrder.$pcontent[i - 1]'
            :label="'Map #' + i"
          >
            <option value=0>The Woodlands</option>
            <option value=1>The Wetlands</option>
            <option value=2>The Snow Line</option>
            <option value=3>Leshy's Cabin</option>
          </table-select>
        </template>
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
