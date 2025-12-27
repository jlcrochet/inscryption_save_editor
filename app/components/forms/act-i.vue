<template>
  <tabs>
    <tab title="Miscellaneous">
      <table>
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
      <table>
        <thead>
          <tr>
            <th style="text-align: right">#</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(mod, i) in saveFile.deathCardMods.$rcontent">
            <tr>
              <td style="text-align: right">{{ i + 1 }}</td>

              <td>
                <input v-model.lazy.trim=mod.nameReplacement required maxlength=16 />
              </td>

              <td class=actions>
                <button type=button @click="openDeathcardDialog(i)">Edit</button>
                <button type=button @click="duplicateDeathcard(i)">Duplicate</button>
                <button type=button @click='listRemove(saveFile.deathCardMods, i)'>Delete</button>
              </td>
            </tr>
          </template>

          <tr>
            <td colspan=3>
              <button type=button @click=addDeathcard>Add Deathcard</button>
            </td>
          </tr>
        </tbody>
      </table>

      <deathcard-mod-dialog ref=deathcardDialogRef />
    </tab>

    <tab title="Items">
      <items-editor :items=saveFile.currentRun.consumables />
    </tab>

    <tab title="Totems">
      <totems-editor
        :totemTops=saveFile.currentRun.totemTops
        :totemBottoms=saveFile.currentRun.totemBottoms
        :totems=saveFile.currentRun.totems
      />
    </tab>

    <tab title="Boons">
      <boons-editor :boonIds=saveFile.currentRun.playerDeck.boonIds />
    </tab>

    <tab title="Painting Puzzle">
      <painting-puzzle-editor :oilPaintingState=saveFile.oilPaintingState />
    </tab>
  </tabs>
</template>

<script setup>
  import * as gameData from '~/game-data'
  import { listNew, listAdd, listRemove, listClone, typeNameWithAssembly } from '~/utils'

  const saveFile = inject('saveFile')

  const deathcardDialogRef = ref(null)

  function openDeathcardDialog(i) {
    deathcardDialogRef.value.open(saveFile.value.deathCardMods.$rcontent[i])
  }

  function duplicateDeathcard(i) {
    const mod = saveFile.value.deathCardMods.$rcontent[i]
    listAdd(saveFile.value.deathCardMods, {
      $type: mod.$type,
      nameReplacement: mod.nameReplacement,
      attackAdjustment: mod.attackAdjustment,
      healthAdjustment: mod.healthAdjustment,
      abilities: listClone(mod.abilities),
      negateAbilities: listClone(mod.negateAbilities),
      bloodCostAdjustment: mod.bloodCostAdjustment,
      bonesCostAdjustment: mod.bonesCostAdjustment,
      addGemCost: listClone(mod.addGemCost),
      specialAbilities: listClone(mod.specialAbilities),
      decalIds: listClone(mod.decalIds),
      deathCardInfo: {
        $type: mod.deathCardInfo.$type,
        headType: mod.deathCardInfo.headType,
        mouthIndex: mod.deathCardInfo.mouthIndex,
        eyesIndex: mod.deathCardInfo.eyesIndex,
        lostEye: mod.deathCardInfo.lostEye
      }
    })
  }

  function addDeathcard() {
    listAdd(saveFile.value.deathCardMods, {
      $type: typeNameWithAssembly('DiskCardGame.CardModificationInfo'),
      nameReplacement: null,
      attackAdjustment: 0,
      healthAdjustment: 0,
      abilities: listNew('DiskCardGame.Ability'),
      negateAbilities: listNew('DiskCardGame.Ability'),
      bloodCostAdjustment: 0,
      bonesCostAdjustment: 0,
      addGemCost: listNew('DiskCardGame.GemType'),
      specialAbilities: listNew('DiskCardGame.SpecialTriggeredAbility'),
      decalIds: listNew('System.String'),
      deathCardInfo: {
        $type: typeNameWithAssembly('DiskCardGame.DeathCardInfo'),
        headType: 0,
        mouthIndex: 0,
        eyesIndex: 0,
        lostEye: false
      },
    })
  }
</script>

<style scoped>
  .actions {
    display: flex;
    gap: 0.5em;
  }
</style>
