<template>
  <tabs>
    <tab title="Miscellaneous">
      <table cellpadding=2>
        <tr>
          <td>Wall candles progress:</td>
          <td><input type=number v-model.lazy.number=saveFile.wallCandlesProgress min=0 required /></td>
        </tr>

        <tr>
          <td>Currency:</td>
          <td><input type=number v-model.lazy.number=saveFile.currentRun.currency min=0 required /></td>
        </tr>

        <tr>
          <td>Lives:</td>
          <td><input type=number v-model.lazy.number=saveFile.currentRun.playerLives min=0 required /></td>
        </tr>

        <tr>
          <td>Maximum lives:</td>
          <td><input type=number v-model.lazy.number=saveFile.currentRun.maxPlayerLives min=0 required /></td>
        </tr>

        <tr>
          <td>Eye state:</td>
          <td>
            <select v-model.number=saveFile.currentRun.eyeState required>
              <template v-for="(state, i) in gameData.eyeStates">
                <option :value=i>{{ state }}</option>
              </template>
            </select>
          </td>
        </tr>

        <tr>
          <td>Run intro completed:</td>
          <td><input type=checkbox v-model=saveFile.currentRun.runIntroCompleted /></td>
        </tr>

        <tr>
          <td><span title="If true, the run will start at the beginning of the Leshy boss battle.">Leshy boss battle</span>:</td>
          <td><input type=checkbox v-model=saveFile.currentRun.leshyBossBattle /></td>
        </tr>

        <tr>
          <td><span title="If true, the eyes on the Bonelord's skull mounted on the wall will turn red. Triggered in-game by clicking on the skull several times.">Bonelord puzzle active</span>:</td>
          <td><input type=checkbox v-model=saveFile.currentRun.bonelordPuzzleActive /></td>
        </tr>

        <tr>
          <td><span title="The number of teeth in the skull on the shelf next to Leshy.">Skull teeth</span>:</td>
          <td><input type=number v-model.lazy.number=saveFile.currentRun.skullTeeth min=0 required /></td>
        </tr>

        <tr>
          <td><span title="Whether or not the campfire survivors have been killed.">Survivors dead</span>:</td>
          <td><input type=checkbox v-model=saveFile.currentRun.survivorsDead /></td>
        </tr>

        <tr>
          <td><span title="Whether or not the Skinning Knife has been purchased from the Trapper.">Skinning Knife bought</span>:</td>
          <td><input type=checkbox v-model=saveFile.currentRun.trapperKnifeBought /></td>
        </tr>

        <tr>
          <td><span title="The appearance of your figurine's head; valid values are 0 to 7.">Avatar head</span>:</td>
          <td><input type=number v-model.lazy.number=saveFile.currentRun.playerAvatarHead min=0 max=7 required /></td>
        </tr>

        <tr>
          <td><span title="The appearance of your figurine's arms; valid values are 0 to 7.">Avatar arms</span>:</td>
          <td><input type=number v-model.lazy.number=saveFile.currentRun.playerAvatarArms min=0 max=7 required /></td>
        </tr>

        <tr>
          <td><span title="The appearance of your figurine's body; valid values are 0 to 7.">Avatar body</span>:</td>
          <td><input type=number v-model.lazy.number=saveFile.currentRun.playerAvatarBody min=0 max=7 required /></td>
        </tr>
      </table>
    </tab>

    <tab title="Deck">
      <deck-editor :deck=saveFile.currentRun.playerDeck />
    </tab>

    <tab title="Deathcards">
      <table cellpadding=8>
        <thead>
          <tr>
            <th>Name</th>
            <th>Modification</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(mod, i) in saveFile.deathCardMods.$rcontent">
            <tr class=card>
              <td>
                <input v-model.lazy.trim=mod.nameReplacement required maxlength=16 />

                <hr />

                <center>
                  <button type=button @click=removeDeathcard(i)>Remove</button>
                </center>
              </td>

              <td>
                <table cellpadding=2>
                  <tr>
                    <td><span title="Adds or subtracts attack points.">Power</span>:</td>
                    <td><input type=number v-model.lazy.number=mod.attackAdjustment /></td>
                  </tr>

                  <tr>
                    <td><span title="Adds or subtracts health points.">Health</span>:</td>
                    <td><input type=number v-model.lazy.number=mod.healthAdjustment /></td>
                  </tr>

                  <tr>
                    <td><span title="Modifies the amount of sacrifices the card requires to play.">Blood</span>:</td>
                    <td><input type=number v-model.lazy.number=mod.bloodCostAdjustment /></td>
                  </tr>

                  <tr>
                    <td><span title="Modifies the amount of bones the card requires to play.">Bones</span>:</td>
                    <td><input type=number v-model.lazy.number=mod.bonesCostAdjustment /></td>
                  </tr>
                </table>

                <hr />

                <table cellpadding=2>
                  <tr>
                    <td><span title="Sigils to add to the card.">Add</span> ({{ mod.abilities.$rlength }}):</td>

                    <td>
                      <select multiple size=8 v-model=mod.abilities.$rcontent @change="mod.abilities.$rlength = $event.target.selectedOptions.length">
                        <template v-for="([ability, description], k) in gameData.abilities">
                          <option :value="k + 1" :title=description>{{ ability }}</option>
                        </template>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td><span title="Sigils to remove from the card.">Remove</span> ({{ mod.negateAbilities.$rlength }}):</td>

                    <td>
                      <select multiple size=8 v-model=mod.negateAbilities.$rcontent @change="mod.negateAbilities.$rlength = $event.target.selectedOptions.length">
                        <template v-for="([ability, description], k) in gameData.abilities">
                          <option :value="k + 1" :title=description>{{ ability }}</option>
                        </template>
                      </select>
                    </td>
                  </tr>
                </table>

                <hr />

                <table cellpadding=2>
                  <tr>
                    <td><span title="Appearance of the figurine's head; valid values range from 0 to 7.">Head</span>:</td>
                    <td><input type=number v-model.lazy.number=mod.deathCardInfo.headType min=0 max=7 required /></td>
                  </tr>

                  <tr>
                    <td><span title="Appearance of the figurine's mouth; valid values range from 0 to 5.">Mouth</span>:</td>
                    <td><input type=number v-model.lazy.number=mod.deathCardInfo.mouthIndex min=0 max=5 required /></td>
                  </tr>

                  <tr>
                    <td><span title="Appearance of the figurine's eyes; valid values range from 0 to 5.">Eyes</span>:</td>
                    <td><input type=number v-model.lazy.number=mod.deathCardInfo.eyesIndex min=0 max=5 required /></td>
                  </tr>

                  <tr>
                    <td><span title="Whether or not the portrait is missing its right eye as a result of using the Special Dagger.">Lost eye</span>:</td>
                    <td><input type=checkbox v-model=mod.deathCardInfo.lostEye /></td>
                  </tr>
                </table>
              </td>
            </tr>
          </template>

          <tr class=card>
            <td>
              <center>
                <button type=button @click=addDeathcard>Add</button>
              </center>
            </td>
          </tr>
        </tbody>
      </table>
    </tab>

    <tab title="Items">
      <table cellpadding=2>
        <template v-for="(consumable, i) in saveFile.currentRun.consumables.$rcontent">
          <tr>
            <td>
              <select v-model=saveFile.currentRun.consumables.$rcontent[i] required>
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
          <td>Tribes ({{ saveFile.currentRun.totemTops.$rlength }}):</td>

          <td>
            <select multiple size=6 v-model=saveFile.currentRun.totemTops.$rcontent @change="saveFile.currentRun.totemTops.$rlength = $event.target.selectedOptions.length">
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
              <select v-model=saveFile.currentRun.totems.$rcontent[0].tribe required>
                <template v-for="i in saveFile.currentRun.totemTops.$rcontent">
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
          <td>Sigils ({{ saveFile.currentRun.totemBottoms.$rlength }}):</td>

          <td>
            <select multiple size=10 v-model=saveFile.currentRun.totemBottoms.$rcontent @change="saveFile.currentRun.totemBottoms.$rlength = $event.target.selectedOptions.length">
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
              <select v-model=saveFile.currentRun.totems.$rcontent[0].ability required>
                <template v-for="i in saveFile.currentRun.totemBottoms.$rcontent">
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
                     v-model=saveFile.currentRun.playerDeck.boonIds.$rcontent
                     @change="saveFile.currentRun.playerDeck.boonIds.$rlength = saveFile.currentRun.playerDeck.boonIds.$rcontent.length" />
            </td>
          </tr>
        </template>
      </table>
    </tab>

    <tab title="Painting Puzzle">
      <table cellpadding=2>
        <template v-for="(card, i) in saveFile.oilPaintingState.puzzleSolution.$rcontent">
          <tr>
            <td>
              <select v-model=saveFile.oilPaintingState.puzzleSolution.$rcontent[i]>
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
          <td><input type=checkbox v-model=saveFile.oilPaintingState.puzzleSolved /></td>
        </tr>

        <tr>
          <td>Reward:</td>
          <td>
            <select v-model.number=saveFile.oilPaintingState.rewardIndex>
              <option value=0>Clover</option>
              <option value=1>Extra Candle</option>
              <option value=2>Bee Statue</option>
            </select>
          </td>
        </tr>

        <tr>
          <td>Reward taken:</td>
          <td><input type=checkbox v-model=saveFile.oilPaintingState.rewardTaken /></td>
        </tr>
      </table>
    </tab>
  </tabs>
</template>

<script setup>
  const saveFile = useState('saveFile')
  const gameData = useState('gameData')

  const totemRequired = computed(() => saveFile.value.currentRun.totemTops.$rlength > 0 && saveFile.value.currentRun.totemBottoms.$rlength > 0)

  watch(() => saveFile.value.currentRun.totemTops.$rlength, newValue => {
      if (newValue == 0) {
          if (saveFile.value.currentRun.totems.$rlength > 0) {
              saveFile.value.currentRun.totems.$rcontent.splice(0)
              saveFile.value.currentRun.totems.$rlength = 0
          }
      } else {
          if (saveFile.value.currentRun.totems.$rlength == 0 && saveFile.value.currentRun.totemBottoms.$rlength > 0) {
              // Stub totem
              saveFile.value.currentRun.totems.$rcontent.push({
                  $type: "DiskCardGame.TotemDefinition, Assembly-CSharp",
                  tribe: null,
                  ability: null
              })

              saveFile.value.currentRun.totems.$rlength = 1
          }
      }
  })

  watch(() => saveFile.value.currentRun.totemTops.$rlength, newValue => {
      if (newValue == 0) {
          if (saveFile.value.currentRun.totems.$rlength > 0) {
              saveFile.value.currentRun.totems.$rcontent.splice(0)
              saveFile.value.currentRun.totems.$rlength = 0
          }
      } else {
          if (saveFile.value.currentRun.totems.$rlength == 0 && saveFile.value.currentRun.totemTops.$rlength > 0) {
              // Stub totem
              saveFile.value.currentRun.totems.$rcontent.push({
                  $type: "DiskCardGame.TotemDefinition, Assembly-CSharp",
                  tribe: null,
                  ability: null
              })

              saveFile.value.currentRun.totems.$rlength = 1
          }
      }
  })

  function addItem() {
      saveFile.value.currentRun.consumables.$rcontent.push(null)
      saveFile.value.currentRun.consumables.$rlength += 1
  }

  function removeItem(i) {
      saveFile.value.currentRun.consumables.$rcontent.splice(i, 1)
      saveFile.value.currentRun.consumables.$rlength -= 1
  }

  function addDeathcard() {
      saveFile.value.deathCardMods.$rcontent.push({
          $type: "DiskCardGame.CardModificationInfo, Assembly-CSharp",
          nameReplacement: null,
          attackAdjustment: 0,
          healthAdjustment: 0,
          abilities: {
              $type: "System.Collections.Generic.List`1[[DiskCardGame.Ability, Assembly-CSharp]], mscorlib",
              $rlength: 0,
              $rcontent: []
          },
          negateAbilities: {
              $type: "System.Collections.Generic.List`1[[DiskCardGame.Ability, Assembly-CSharp]], mscorlib",
              $rlength: 0,
              $rcontent: []
          },
          bloodCostAdjustment: 0,
          bonesCostAdjustment: 0,
          addGemCost: {
              $type: "System.Collections.Generic.List`1[[DiskCardGame.GemType, Assembly-CSharp]], mscorlib",
              $rlength: 0,
              $rcontent: []
          },
          specialAbilities: {
              $type: "System.Collections.Generic.List`1[[DiskCardGame.SpecialTriggeredAbility, Assembly-CSharp]], mscorlib",
              $rlength: 0,
              $rcontent: []
          },
          deathCardInfo: {
              $type: "DiskCardGame.DeathCardInfo, Assembly-CSharp",
              headType: 0,
              mouthIndex: 0,
              eyesIndex: 0,
              lostEye: false
          },
          decalIds: {
              $type: "System.Collections.Generic.List`1[[System.String, mscorlib]], mscorlib",
              $rlength: 0,
              $rcontent: []
          }
      })

      saveFile.value.deathCardMods.$rlength += 1
  }

  function removeDeathcard(i) {
      saveFile.value.deathCardMods.$rcontent.splice(i, 1)
      saveFile.value.deathCardMods.$rlength -= 1
  }
</script>
