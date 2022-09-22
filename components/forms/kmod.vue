<template>
  <tabs>
    <tab title="Miscellaneous">
      <table cellpadding=2>
        <tr>
          <td>Challenge level:</td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.challengeLevel min=0 required /></td>
        </tr>

        <tr>
          <td>Run seed:</td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.currentRunSeed required /></td>
        </tr>

        <tr>
          <td>Ouroboros deaths:</td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.currentOuroborosDeaths min=0 required /></td>
        </tr>

        <tr>
          <td><span title="If 0, your deck will start with two Rabbit Pelts; if 1, your deck will start with an Opossum and a Rabbit Pelt; else, your deck will start with an Opossum and a Ring Worm.">Runs since first boss was reached</span>:</td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.numRunsSinceReachedFirstBoss min=0 required /></td>
        </tr>

        <tr>
          <td>Currency:</td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.currentRun.currency min=0 max=999 required /></td>
        </tr>

        <tr>
          <td>Lives:</td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.currentRun.playerLives min=0 required /></td>
        </tr>

        <tr>
          <td>Maximum lives:</td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.currentRun.maxPlayerLives min=0 required /></td>
        </tr>

        <tr>
          <td>Eye state:</td>
          <td>
            <select v-model.number=saveFile.ascensionData.currentRun.eyeState required>
              <template v-for="(state, i) in gameData.eyeStates">
                <option :value=i>{{ state }}</option>
              </template>
            </select>
          </td>
        </tr>

        <tr>
          <td><span title="If true, the eyes on the Bonelord's skull mounted on the wall will turn red; triggered in-game by clicking on the skull several times.">Bonelord puzzle active</span>:</td>
          <td><input type=checkbox v-model=saveFile.ascensionData.currentRun.bonelordPuzzleActive /></td>
        </tr>

        <tr>
          <td><span title="Whether or not the campfire survivors have been killed.">Survivors dead</span>:</td>
          <td><input type=checkbox v-model=saveFile.ascensionData.currentRun.survivorsDead /></td>
        </tr>

        <tr>
          <td><span title="Whether or not the Skinning Knife has been purchased from the Trapper.">Skinning Knife bought</span>:</td>
          <td><input type=checkbox v-model=saveFile.ascensionData.currentRun.trapperKnifeBought /></td>
        </tr>
      </table>
    </tab>

    <tab title="Decks">
      <deck-editor :deck=saveFile.ascensionData.currentRun.playerDeck :game-data=gameData />
    </tab>

    <tab title="Items">
      <table cellpadding=2>
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
              <button type=button @click=removeItem(i)>Remove</button>
            </td>
          </tr>
        </template>

        <tr>
          <td>
            <button type=button @click=addItem>Add</button>
          </td>
        </tr>
      </table>
    </tab>

    <tab title="Totems">
      <table cellpadding=2>
        <tr>
          <td>Tribes ({{ saveFile.ascensionData.currentRun.totemTops.$rlength }}):</td>

          <td>
            <select multiple size=6 v-model=saveFile.ascensionData.currentRun.totemTops.$rcontent @change="saveFile.ascensionData.currentRun.totemTops.$rlength = $event.target.selectedOptions.length">
              <template v-for="(tribe, i) in gameData.tribes">
                <option :value="i + 1">{{ tribe }}</option>
              </template>
            </select>
          </td>
        </tr>

        <template v-if=totemRequired>
          <tr>
            <td>Selected:</td>

            <td>
              <select v-model=saveFile.ascensionData.currentRun.totems.$rcontent[0].tribe required>
                <template v-for="i in saveFile.ascensionData.currentRun.totemTops.$rcontent">
                  <option :value=i>{{ gameData.tribes[i - 1] }}</option>
                </template>
              </select>
            </td>
          </tr>
        </template>
      </table>

      <hr />

      <table cellpadding=2>
        <tr>
          <td>Sigils ({{ saveFile.ascensionData.currentRun.totemBottoms.$rlength }}):</td>

          <td>
            <select multiple size=10 v-model=saveFile.ascensionData.currentRun.totemBottoms.$rcontent @change="saveFile.ascensionData.currentRun.totemBottoms.$rlength = $event.target.selectedOptions.length">
              <template v-for="([ability, description], i) in gameData.abilities">
                <option :value="i + 1" :title=description>{{ ability }}</option>
              </template>
            </select>
          </td>
        </tr>

        <template v-if=totemRequired>
          <tr>
            <td>Selected:</td>

            <td>
              <select v-model=saveFile.ascensionData.currentRun.totems.$rcontent[0].ability required>
                <template v-for="i in saveFile.ascensionData.currentRun.totemBottoms.$rcontent">
                  <option :value=i :title="gameData.abilities[i - 1][1]">{{ gameData.abilities[i - 1][0] }}</option>
                </template>
              </select>
            </td>
          </tr>
        </template>
      </table>
    </tab>

    <tab title="Boons">
      <table cellpadding=2>
        <template v-for="([name, description], i) in gameData.boons">
          <tr>
            <td><span :title=description>{{ name }}</span></td>
            <td>
              <input type=checkbox
                     :value="i + 1"
                     v-model=saveFile.ascensionData.currentRun.playerDeck.boonIds.$rcontent
                     @change="saveFile.ascensionData.currentRun.playerDeck.boonIds.$rlength = saveFile.ascensionData.currentRun.playerDeck.boonIds.$rcontent.length" />
            </td>
          </tr>
        </template>
      </table>
    </tab>

    <tab title="Painting Puzzle">
      <table cellpadding=2>
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

      <table cellpadding=2>
        <tr>
          <td>Solved:</td>
          <td><input type=checkbox v-model=saveFile.ascensionData.oilPaintingState.puzzleSolved /></td>
        </tr>

        <tr>
          <td>Reward:</td>
          <td>
            <select v-model.number=saveFile.ascensionData.oilPaintingState.rewardIndex>
              <option value=0>Magickal Bleach</option>
              <option value=1>Wiseclock</option>
              <option value=2>Magpie's Glass</option>
            </select>
          </td>
        </tr>

        <tr>
          <td>Reward taken:</td>
          <td><input type=checkbox v-model=saveFile.ascensionData.oilPaintingState.rewardTaken /></td>
        </tr>
      </table>
    </tab>

    <tab title="Maps">
      <table cellpadding=2>
        <tr>
          <td><span title="Zero-based index for the current map; 0 for Map #1, 1 for Map #2, etc.">Current map:</span></td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.currentRun.regionTier min=0 required /></td>
        </tr>

        <template v-for="i in saveFile.ascensionData.currentRun.regionOrder.$plength">
          <tr>
            <td>Map #{{ i }}:</td>
            <td>
              <select v-model.number="saveFile.ascensionData.currentRun.regionOrder.$pcontent[i - 1]">
                <option value=0>The Woodlands</option>
                <option value=1>The Wetlands</option>
                <option value=2>The Snow Line</option>
                <option value=3>Leshy's Cabin</option>
              </select>
            </td>
          </tr>
        </template>
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
                     @change="saveFile.ascensionData.conqueredStarterDecks.$rlength = saveFile.ascensionData.conqueredStarterDecks.$rcontent.length" />
            </td>
          </tr>
        </template>
      </table>
    </tab>
  </tabs>
</template>

<script setup>
  const props = defineProps({
      saveFile: {
          type: Object,
          required: true
      },
      gameData: {
          type: Object,
          required: true
      }
  })

  const totemRequired = computed(() => props.saveFile.ascensionData.currentRun.totemTops.$rlength > 0 && props.saveFile.ascensionData.currentRun.totemBottoms.$rlength > 0)

  watch(() => props.saveFile.ascensionData.currentRun.totemTops.$rlength, newValue => {
      if (newValue == 0) {
          if (props.saveFile.ascensionData.currentRun.totems.$rlength > 0) {
              props.saveFile.ascensionData.currentRun.totems.$rcontent.splice(0)
              props.saveFile.ascensionData.currentRun.totems.$rlength = 0
          }
      } else {
          if (props.saveFile.ascensionData.currentRun.totems.$rlength == 0 && props.saveFile.ascensionData.currentRun.totemBottoms.$rlength > 0) {
              // Stub totem
              props.saveFile.ascensionData.currentRun.totems.$rcontent.push({
                  $type: "DiskCardGame.TotemDefinition, Assembly-CSharp",
                  tribe: null,
                  ability: null
              })

              props.saveFile.ascensionData.currentRun.totems.$rlength = 1
          }
      }
  })

  watch(() => props.saveFile.ascensionData.currentRun.totemTops.$rlength, newValue => {
      if (newValue == 0) {
          if (props.saveFile.ascensionData.currentRun.totems.$rlength > 0) {
              props.saveFile.ascensionData.currentRun.totems.$rcontent.splice(0)
              props.saveFile.ascensionData.currentRun.totems.$rlength = 0
          }
      } else {
          if (props.saveFile.ascensionData.currentRun.totems.$rlength == 0 && props.saveFile.ascensionData.currentRun.totemTops.$rlength > 0) {
              // Stub totem
              props.saveFile.ascensionData.currentRun.totems.$rcontent.push({
                  $type: "DiskCardGame.TotemDefinition, Assembly-CSharp",
                  tribe: null,
                  ability: null
              })

              props.saveFile.ascensionData.currentRun.totems.$rlength = 1
          }
      }
  })

  function addItem() {
      props.saveFile.ascensionData.currentRun.consumables.$rcontent.push(null)
      props.saveFile.ascensionData.currentRun.consumables.$rlength += 1
  }

  function removeItem(i) {
      props.saveFile.ascensionData.currentRun.consumables.$rcontent.splice(i, 1)
      props.saveFile.ascensionData.currentRun.consumables.$rlength -= 1
  }
</script>
