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
          <template v-for="(state, i) in eyeStates">
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
          v-model.number=saveFile.currentRun.playerAvatarHead
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

        <tbody ref=deathcardsTbodyRef>
          <tr v-for="(mod, i) in saveFile.deathCardMods.$rcontent" :key=i>
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

          <tr>
            <td></td>
            <td>
              <button type=button @click=addDeathcard>Add Deathcard</button>
            </td>
          </tr>
        </tbody>
      </table>

      <deathcard-mod-dialog ref=deathcardDialogRef />
    </tab>

    <tab title="Items">
      <items-editor :itemList=saveFile.currentRun.consumables />
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
  const saveFile = inject('saveFile')

  const deathcardDialogRef = ref(null)
  const deathcardsTbodyRef = ref(null)

  function openDeathcardDialog(i) {
    deathcardDialogRef.value.open(saveFile.value.deathCardMods.$rcontent[i])
  }

  function duplicateDeathcard(i) {
    const mod = saveFile.value.deathCardMods.$rcontent[i]
    listAdd(saveFile.value.deathCardMods, cloneMod(mod))
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
      energyCostAdjustment: 0,
      nullifyGemsCost: false,
      addGemCost: listNew('DiskCardGame.GemType'),
      gemify: false,
      specialAbilities: listNew('DiskCardGame.SpecialTriggeredAbility'),
      fromCardMerge: false,
      decalIds: listNew('System.String'),
      deathCardInfo: {
        $type: typeNameWithAssembly('DiskCardGame.DeathCardInfo'),
        headType: 0,
        mouthIndex: 0,
        eyesIndex: 0,
        lostEye: false
      },
    })
    nextTick(() => {
      const rows = deathcardsTbodyRef.value.children
      const lastCardRow = rows[rows.length - 2]
      const input = lastCardRow?.cells[1]?.firstElementChild
      input?.focus()
    })
  }
</script>

<style scoped>
  .actions {
    display: flex;
    gap: 0.5em;
  }
</style>
