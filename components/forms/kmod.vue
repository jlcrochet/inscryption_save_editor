<template>
  <tab-list :titles="['Miscellaneous', 'Deck', 'Items', 'Totems', 'Boons', 'Painting Puzzle', 'Maps', 'Conquered Starter Decks']">
    <template #0>
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
    </template>

    <template #1>
      <deck-editor :deck=saveFile.ascensionData.currentRun.playerDeck :game-data=gameData />
    </template>

    <template #2>
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
    </template>

    <template #3>
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
                <template v-for="(tribe, i) in gameData.tribes">
                  <template v-if="saveFile.ascensionData.currentRun.totemTops.$rcontent.includes(i + 1)">
                    <option :value="i + 1">{{ tribe }}</option>
                  </template>
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
                <template v-for="([ability, description], i) in gameData.abilities">
                  <template v-if="saveFile.ascensionData.currentRun.totemBottoms.$rcontent.includes(i + 1)">
                    <option :value="i + 1" :title=description>{{ ability }}</option>
                  </template>
                </template>
              </select>
            </td>
          </tr>
        </template>
      </table>
    </template>

    <template #4>
      <table cellpadding=2>
        <template v-for="([name, description], i) in gameData.boons">
          <tr>
            <td><span :title=description>{{ name }}</span></td>
            <td>
              <input type=checkbox
                     :value="i + 1"
                     :checked="saveFile.ascensionData.currentRun.playerDeck.boonIds.$rcontent.includes(i + 1)"
                     @change="toggleBoon(i + 1, $event.target.checked)" />
            </td>
          </tr>
        </template>
      </table>
    </template>

    <template #5>
      <table cellpadding=2>
        <template v-for="(card, i) in saveFile.ascensionData.oilPaintingState.puzzleSolution.$rcontent">
          <tr>
            <td>
              <select v-model=saveFile.ascensionData.oilPaintingState.puzzleSolution.$rcontent[i]>
                <option :value=null>(empty)</option>
                <template v-for="[gameName, value] in gameData.cardNames">
                  <option :value=value :selected="card === value">{{ gameName }}</option>
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
    </template>

    <template #6>
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
    </template>

    <template #7>
      <table cellpadding=2>
        <template v-for="deck in gameData.starterDecks">
          <tr>
            <td>{{ deck }}</td>
            <td>
              <input type=checkbox
                     :value=deck
                     :checked=saveFile.ascensionData.conqueredStarterDecks.$rcontent.includes(deck)
                     @change="toggleStarterDeck(deck, $event.target.checked)" />
            </td>
          </tr>
        </template>
      </table>
    </template>
  </tab-list>
</template>

<script>
  export default {
      props: {
          saveFile: {
              type: Object,
              required: true
          },
          gameData: {
              type: Object,
              required: true
          }
      },

      computed: {
          totemRequired() {
              return this.saveFile.ascensionData.currentRun.totemTops.$rlength > 0 && this.saveFile.ascensionData.currentRun.totemBottoms.$rlength > 0
          }
      },

      watch: {
          "saveFile.ascensionData.currentRun.totemTops.$rlength"(newVal) {
              if (newVal === 0) {
                  if (this.saveFile.ascensionData.currentRun.totems.$rlength > 0) {
                      this.saveFile.ascensionData.currentRun.totems.$rcontent.splice(0)
                      this.saveFile.ascensionData.currentRun.totems.$rlength = 0
                  }
              } else {
                  if (this.saveFile.ascensionData.currentRun.totems.$rlength === 0 && this.saveFile.ascensionData.currentRun.totemBottoms.$rlength > 0) {
                      // Stub totem
                      this.saveFile.ascensionData.currentRun.totems.$rcontent.push({
                          $type: "DiskCardGame.TotemDefinition, Assembly-CSharp",
                          tribe: null,
                          ability: null
                      })

                      this.saveFile.ascensionData.currentRun.totems.$rlength = 1
                  }
              }
          },

          "saveFile.ascensionData.currentRun.totemBottoms.$rlength"(newVal) {
              if (newVal === 0) {
                  if (this.saveFile.ascensionData.currentRun.totems.$rlength > 0) {
                      this.saveFile.ascensionData.currentRun.totems.$rcontent.splice(0)
                      this.saveFile.ascensionData.currentRun.totems.$rlength = 0
                  }
              } else {
                  if (this.saveFile.ascensionData.currentRun.totems.$rlength === 0 && this.saveFile.ascensionData.currentRun.totemTops.$rlength > 0) {
                      // Stub totem
                      this.saveFile.ascensionData.currentRun.totems.$rcontent.push({
                          $type: "DiskCardGame.TotemDefinition, Assembly-CSharp",
                          tribe: null,
                          ability: null
                      })

                      this.saveFile.ascensionData.currentRun.totems.$rlength = 1
                  }
              }
          }
      },

      methods: {
          addItem() {
              this.saveFile.ascensionData.currentRun.consumables.$rcontent.push(null)
              this.saveFile.ascensionData.currentRun.consumables.$rlength += 1
          },

          removeItem(i) {
              this.saveFile.ascensionData.currentRun.consumables.$rcontent.splice(i, 1)
              this.saveFile.ascensionData.currentRun.consumables.$rlength -= 1
          },

          toggleStarterDeck(name, checked) {
              if (checked) {
                  this.saveFile.ascensionData.conqueredStarterDecks.$rcontent.push(name)
                  this.saveFile.ascensionData.conqueredStarterDecks.$rlength += 1
              } else {
                  let idx = this.saveFile.ascensionData.conqueredStarterDecks.$rcontent.indexOf(name)

                  this.saveFile.ascensionData.conqueredStarterDecks.$rcontent.splice(idx, 1)
                  this.saveFile.ascensionData.conqueredStarterDecks.$rlength -= 1
              }
          },

          toggleBoon(i, checked) {
              if (checked) {
                  this.saveFile.ascensionData.currentRun.playerDeck.boonIds.$rcontent.push(i)
                  this.saveFile.ascensionData.currentRun.playerDeck.boonIds.$rlength += 1
              } else {
                  let idx = this.saveFile.ascensionData.currentRun.playerDeck.boonIds.$rcontent.indexOf(i)

                  this.saveFile.ascensionData.currentRun.playerDeck.boonIds.$rcontent.splice(idx, 1)
                  this.saveFile.ascensionData.currentRun.playerDeck.boonIds.$rlength -= 1
              }
          }
      }
  }
</script>
