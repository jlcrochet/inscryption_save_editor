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
          <template v-for="(state, i) in gameData.eyeStates">
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
      <table cellpadding=4>
        <template v-for="(consumable, i) in saveFile.ascensionData.currentRun.consumables.$rcontent">
          <tr>
            <td>
              <select v-model=saveFile.ascensionData.currentRun.consumables.$rcontent[i] required>
                <template v-for="[gameName, value] in gameData.items">
                  <option :value=value>{{ gameName }}</option>
                </template>
              </select>
            </td>

            <td>
              <button type=button @click='listRemove(saveFile.ascensionData.currentRun.consumables, i)'>Remove</button>
            </td>
          </tr>
        </template>

        <tr>
          <td>
            <button type=button @click='listAdd(saveFile.ascensionData.currentRun.consumables, null)'>Add</button>
          </td>
        </tr>
      </table>
    </tab>

    <tab title="Totems">
      <table cellpadding=4>
        <table-select
          v-model=totemTops.$rcontent
          @change="totemTops.$rlength = $event.target.selectedOptions.length"
          label=Tribes
          help="Which totem heads you have"
          multiple size=6
        >
          <template v-for='(tribe, i) in gameData.tribes'>
            <option :value="i + 1">{{ tribe }}</option>
          </template>
        </table-select>

        <template v-if='totems.$rlength > 0'>
          <table-select v-model=totems.$rcontent[0].tribe label=Selected required>
            <template v-for="i in totemTops.$rcontent">
              <option :value=i>{{ gameData.tribes[i - 1] }}</option>
            </template>
          </table-select>
        </template>

        <br />

        <table-select
          v-model=totemBottoms.$rcontent
          @change="totemBottoms.$rlength = $event.target.selectedOptions.length"
          label=Sigils
          help="Which totem bodies you have"
          multiple size=10
        >
          <template v-for="([ability, description], i) in gameData.abilities">
            <option :value="i + 1" :title=description>{{ ability }}</option>
          </template>
        </table-select>

        <template v-if='totems.$rlength > 0'>
          <table-select v-model=totems.$rcontent[0].ability label=Selected required>
            <template v-for="i in totemBottoms.$rcontent">
              <option :value=i :title='gameData.abilities[i - 1][1]'>{{ gameData.abilities[i - 1][0] }}</option>
            </template>
          </table-select>
        </template>
      </table>
    </tab>

    <tab title="Boons">
      <table cellpadding=4>
        <template v-for="([name, description], i) in gameData.boons">
          <table-input
            v-model=saveFile.ascensionData.currentRun.playerDeck.boonIds.$rcontent
            :value="i + 1"
            @change="saveFile.ascensionData.currentRun.playerDeck.boonIds.$rlength = saveFile.ascensionData.currentRun.playerDeck.boonIds.$rcontent.length"
            :label=name
            :help=description
            type=checkbox
          />
        </template>
      </table>
    </tab>

    <tab title="Painting Puzzle">
      <blockquote>
        These represent spaces on the board from left to right
      </blockquote>

      <table cellpadding=4>
        <template v-for="(card, i) in saveFile.ascensionData.oilPaintingState.puzzleSolution.$rcontent">
          <tr>
            <td>
              <select v-model=saveFile.ascensionData.oilPaintingState.puzzleSolution.$rcontent[i]>
                <option :value=null>(empty)</option>
                <template v-for="[gameName, value] in gameData.cardNames">
                  <option :value=value :selected="card == value">{{ gameName }}</option>
                </template>
              </select>
            </td>
          </tr>
        </template>
      </table>

      <hr />

      <table cellpadding=4>
        <table-input v-model=saveFile.ascensionData.oilPaintingState.puzzleSolved type=checkbox label=Solved />
        <table-select v-model.number=saveFile.ascensionData.oilPaintingState.rewardIndex label=Reward>
          <option value=0>Clover</option>
          <option value=1>Extra Candle</option>
          <option value=2>Bee Statue</option>
        </table-select>
        <table-input v-model=saveFile.ascensionData.oilPaintingState.rewardTaken type=checkbox label='Reward taken' />
      </table>
    </tab>

    <tab title="Maps">
      <table cellpadding=4>
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
      <table cellpadding=4>
        <template v-for="deck in gameData.starterDecks">
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
  import * as gameData from '~/game-data'
  import { listAdd, listRemove, listClear } from '~/utils'

  const saveFile = useState('saveFile')

  const totemTops = ref(saveFile.value.ascensionData.currentRun.totemTops)
  const totemBottoms = ref(saveFile.value.ascensionData.currentRun.totemBottoms)
  const totems = ref(saveFile.value.ascensionData.currentRun.totems)

  watch(
    [
      () => totemTops.value.$rcontent,
      () => totemBottoms.value.$rcontent
    ],
    ([top, bottom]) => {
      if (top.length > 0 && bottom.length > 0) {
        if (totems.value.$rlength == 0) {
          // Stub totem
          listAdd(totems.value, {
            $type: "DiskCardGame.TotemDefinition, Assembly-CSharp",
            tribe: null,
            ability: null
          })
        }

        totems.value.$rcontent[0].tribe = top[0]
        totems.value.$rcontent[0].ability = bottom[0]
      } else {
        if (totems.value.$rlength > 0) {
          // Empty totems list
          listClear(totems.value)
        }
      }
    }
  )
</script>
