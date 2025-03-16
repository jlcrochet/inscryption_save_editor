<template>
  <tabs>
    <tab title="Miscellaneous">
      <table cellpadding=4>
        <table-input
          v-model.number=saveFile.wallCandlesProgress
          label='Wall candles progress'
          type=number min=0 required
        />
        <table-input
          v-model.number=saveFile.currentRun.currency
          label=Currency
          type=number min=0 required
        />
        <table-input
          v-model.number=saveFile.currentRun.playerLives
          label='Player lives'
          type=number min=0 required
        />
        <table-input
          v-model.number=saveFile.currentRun.maxPlayerLives
          label='Maximum player lives'
          type=number min=0 required
        />

        <table-select
          v-model.number=saveFile.currentRun.eyeState
          label='Eye state'
          required
        >
          <template v-for="(state, i) in gameData.eyeStates">
            <option :value=i>{{ state }}</option>
          </template>
        </table-select>

        <table-input
          v-model=saveFile.currentRun.runIntroCompleted
          label='Run intro completed'
          type=checkbox
        />
        <table-input
          v-model=saveFile.currentRun.leshyBossBattle
          label='Leshy boss battle'
          help="If true, the run will start at the beginning of the Leshy boss battle."
          type=checkbox
        />
        <table-input
          v-model=saveFile.currentRun.bonelordPuzzleActive
          label='Bonelord puzzle active'
          help="If true, the eyes on the Bonelord's skull mounted on the wall will turn red. Triggered in-game by clicking on the skull several times."
          type=checkbox
        />
        <table-input
          v-model.number=saveFile.currentRun.skullTeeth
          label='Skull teeth'
          help="The number of teeth in the skull on the shelf next to Leshy."
          type=number min=0 required
        />
        <table-input
          v-model=saveFile.currentRun.survivorsDead
          label='Survivors dead'
          help="Whether or not the campfire survivors have been killed."
          type=checkbox
        />
        <table-input
          v-model=saveFile.currentRun.trapperKnifeBought
          label='Skinning Knife bought'
          help="Whether or not the Skinning Knife has been purchased from the Trapper."
          type=checkbox
        />
        <table-input
          v-model=saveFile.currentRun.playerAvatarHead
          label='Avatar head'
          help="The appearance of your figurine's head; valid values are 0 to 7."
          type=number min=0 max=7 required
        />
        <table-input
          v-model.number=saveFile.currentRun.playerAvatarArms
          label='Avatar arms'
          help="The appearance of your figurine's arms; valid values are 0 to 7."
          type=number min=0 max=7 required
        />
        <table-input
          v-model.number=saveFile.currentRun.playerAvatarBody
          label='Avatar body'
          help="The appearance of your figurine's body; valid values are 0 to 7."
          type=number min=0 max=7 required
        />
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
                  <button type=button @click='listRemove(saveFile.deathCardMods, i)'>Remove</button>
                </center>
              </td>

              <td>
                <table cellpadding=4>
                  <table-input
                    v-model.number=mod.attackAdjustment
                    label=Power
                    help="Adds or subtracts attack points."
                    type=number
                  />
                  <table-input
                    v-model.number=mod.healthAdjustment
                    label=Health
                    help="Adds or subtracts health points."
                    type=number
                  />
                  <table-input
                    v-model.number=mod.bloodCostAdjustment
                    label=Blood
                    help="Modifies the amount of sacrifices the card requires to play."
                    type=number
                  />
                  <table-input
                    v-model.number=mod.bonesCostAdjustment
                    label=Bones
                    help="Modifies the amount of bones the card requires to play."
                    type=number
                  />
                </table>

                <hr />

                <table cellpadding=4>
                  <table-select
                    v-model=mod.abilities.$rcontent
                    @change="mod.abilities.$rlength = $event.target.selectedOptions.length"
                    :label="`Add (${mod.abilities.$rlength})`"
                    help="Sigils to add to the card."
                    multiple size=8
                  >
                    <template v-for="([ability, description], k) in gameData.abilities">
                      <option :value="k + 1" :title=description>{{ ability }}</option>
                    </template>
                  </table-select>

                  <table-select
                    v-model=mod.negateAbilities.$rcontent
                    @change="mod.negateAbilities.$rlength = $event.target.selectedOptions.length"
                    :label="`Remove (${mod.negateAbilities.$rlength})`"
                    help="Sigils to remove from the card."
                    multiple size=8
                  >
                    <template v-for="([ability, description], k) in gameData.abilities">
                      <option :value="k + 1" :title=description>{{ ability }}</option>
                    </template>
                  </table-select>
                </table>

                <hr />

                <table cellpadding=4>
                  <table-input
                    v-model.number=mod.deathCardInfo.headType
                    label=Head
                    help="Appearance of the figurine's head; valid values range from 0 to 7."
                    type=number min=0 max=7 required
                  />
                  <table-input
                    v-model.number=mod.deathCardInfo.mouthIndex
                    label=Mouth
                    help="Appearance of the figurine's mouth; valid values range from 0 to 5."
                    type=number min=0 max=5 required
                  />
                  <table-input
                    v-model.number=mod.deathCardInfo.eyesIndex
                    label=Eyes
                    help="Appearance of the figurine's eyes; valid values range from 0 to 5."
                    type=number min=0 max=5 required
                  />
                  <table-input
                    v-model=mod.deathCardInfo.lostEye
                    label='Lost eye'
                    help="Whether or not the portrait is missing its right eye as a result of using the Special Dagger."
                    type=checkbox
                  />
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
      <table cellpadding=4>
        <tbody>
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
                <button type=button @click='listRemove(saveFile.currentRun.consumables, i)'>Remove</button>
              </td>
            </tr>
          </template>

          <tr>
            <td>
              <button type=button @click='listAdd(saveFile.currentRun.consumables, null)'>Add</button>
            </td>
          </tr>
        </tbody>
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
            v-model=saveFile.currentRun.playerDeck.boonIds.$rcontent
            :value="i + 1"
            @change="saveFile.currentRun.playerDeck.boonIds.$rlength = saveFile.currentRun.playerDeck.boonIds.$rcontent.length"
            :label=name
            :help=description
            type=checkbox
          />
        </template>
      </table>
    </tab>

    <tab title="Painting Puzzle">
      <blockquote>
        These represent spaces on the board from left to right:
      </blockquote>

      <table cellpadding=4>
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

      <table cellpadding=4>
        <table-input v-model=saveFile.oilPaintingState.puzzleSolved type=checkbox label=Solved />
        <table-select v-model.number=saveFile.oilPaintingState.rewardIndex label=Reward>
          <option value=0>Clover</option>
          <option value=1>Extra Candle</option>
          <option value=2>Bee Statue</option>
        </table-select>
        <table-input v-model=saveFile.oilPaintingState.rewardTaken type=checkbox label='Reward taken' />
      </table>
    </tab>
  </tabs>
</template>

<script setup>
  import * as gameData from '~/game-data'
  import { listAdd, listRemove, listClear } from '~/utils'

  const saveFile = inject('saveFile')

  const totemTops = ref(saveFile.value.currentRun.totemTops)
  const totemBottoms = ref(saveFile.value.currentRun.totemBottoms)
  const totems = ref(saveFile.value.currentRun.totems)

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

  function addDeathcard() {
    listAdd(saveFile.value.deathCardMods, {
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
  }
</script>
