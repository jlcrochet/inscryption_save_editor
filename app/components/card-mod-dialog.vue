<template>
  <dialog ref=dialogRef @close=onClose @click=closeOnBackdrop>
    <template v-if="mods && mods.$rlength > 0">
      <div class=pagination>
        <button type=button @click=prevMod :disabled="modIndex === 0">&lt;</button>
        <span>{{ modIndex + 1 }} / {{ mods.$rlength }}</span>
        <button type=button @click=nextMod :disabled="modIndex === mods.$rlength - 1">&gt;</button>
      </div>

      <hr />

      <table>
        <table-input
          ref=nameInputRef
          v-model.trim=currentMod.nameReplacement
          label=Name
          help="Changes the displayed name of this card."
          maxlength=16
        />
        <table-input
          v-model.number=currentMod.attackAdjustment
          label=Power
          help="Adds or subtracts attack points."
          type=number
        />
        <table-input
          v-model.number=currentMod.healthAdjustment
          label=Health
          help="Adds or subtracts health points."
          type=number
        />
        <table-input
          v-model.number=currentMod.bloodCostAdjustment
          label=Blood
          help="Increases or decreases the number of sacrifices this card requires to play."
          type=number
        />
        <table-input
          v-model.number=currentMod.bonesCostAdjustment
          label=Bones
          help="Increases or decreases the number of bones this card requires to play."
          type=number
        />
        <table-input
          v-model.number=currentMod.energyCostAdjustment
          label=Energy
          help="Increases or decreases the amount of energy this card requires to play."
          type=number
        />
        <table-input
          v-model=currentMod.nullifyGemsCost
          label="Mox nullified"
          help="If true, any gem requirements this card originally had are removed."
          type=checkbox
        />
        <table-input
          v-model.number=currentMod.gemify
          label=Gemified
          help="If true, this card is now gemified."
          type=checkbox
        />
        <table-input
          v-model.number=currentMod.fromCardMerge
          label=Merged
          help="If true, this mod occurred as the result of a card merge of some sort, such as the Mysterious Stones or the Mycologists. Determines the appearance of any added sigils as well as whether or not this card can be used in subsequent merges."
          type=checkbox
        />
      </table>

      <hr />

      <table>
        <table-select
          v-model=currentMod.abilities.$rcontent
          @change="currentMod.abilities.$rlength = $event.target.selectedOptions.length"
          :label="`Add (${currentMod.abilities.$rlength})`"
          help="Sigils to add to this card."
          multiple size=8
        >
          <template v-for="([ability, description], k) in abilities">
            <option :value="k + 1" :title=description>{{ ability }}</option>
          </template>
        </table-select>

        <table-select
          v-model=currentMod.negateAbilities.$rcontent
          @change="currentMod.negateAbilities.$rlength = $event.target.selectedOptions.length"
          :label="`Remove (${currentMod.negateAbilities.$rlength})`"
          help="Sigils to remove from this card."
          multiple size=8
        >
          <template v-for="([ability, description], k) in abilities">
            <option :value="k + 1" :title=description>{{ ability }}</option>
          </template>
        </table-select>
      </table>

      <hr />

      <div class=actions>
        <button type=button @click=addMod>Add Mod</button>
        <button type=button @click=duplicateMod>Duplicate</button>
        <button type=button @click=deleteMod>Delete</button>
        <button type=button @click=close>Close</button>
      </div>
    </template>

    <template v-else>
      <p>No modifications for this card.</p>

      <div class=actions>
        <button type=button @click=addMod>Add Mod</button>
        <button type=button @click=close>Close</button>
      </div>
    </template>
  </dialog>
</template>

<script setup>
  const dialogRef = ref(null)
  const mods = ref(null)
  const modIndex = ref(0)
  const nameInputRef = ref(null)

  const currentMod = computed(() => {
    if (!mods.value || mods.value.$rlength === 0) return null
    return mods.value.$rcontent[modIndex.value]
  })

  function open(cardMods) {
    mods.value = cardMods
    modIndex.value = 0
    dialogRef.value.showModal()
  }

  function close() {
    dialogRef.value.close()
  }

  function closeOnBackdrop(event) {
    if (event.target === dialogRef.value) {
      dialogRef.value.close()
    }
  }

  function onClose() {
    mods.value = null
    modIndex.value = 0
  }

  function prevMod() {
    if (modIndex.value > 0) {
      modIndex.value--
    }
  }

  function nextMod() {
    if (modIndex.value < mods.value.$rlength - 1) {
      modIndex.value++
    }
  }

  function addMod() {
    listAdd(mods.value, {
      $type: typeNameWithAssembly("DiskCardGame.CardModificationInfo"),
      nameReplacement: null,
      attackAdjustment: 0,
      healthAdjustment: 0,
      abilities: listNew("DiskCardGame.Ability"),
      negateAbilities: listNew("DiskCardGame.Ability"),
      bloodCostAdjustment: 0,
      bonesCostAdjustment: 0,
      energyCostAdjustment: 0,
      nullifyGemsCost: false,
      addGemCost: listNew("DiskCardGame.GemType"),
      gemify: false,
      specialAbilities: listNew("DiskCardGame.SpecialTriggeredAbility"),
      fromCardMerge: false,
      deathCardInfo: null,
      decalIds: listNew("System.String")
    })
    modIndex.value = mods.value.$rlength - 1
    nextTick(() => nameInputRef.value?.focus())
  }

  function duplicateMod() {
    const mod = currentMod.value
    listAdd(mods.value, {
      $type: mod.$type,
      nameReplacement: mod.nameReplacement,
      attackAdjustment: mod.attackAdjustment,
      healthAdjustment: mod.healthAdjustment,
      abilities: listClone(mod.abilities),
      negateAbilities: listClone(mod.negateAbilities),
      bloodCostAdjustment: mod.bloodCostAdjustment,
      bonesCostAdjustment: mod.bonesCostAdjustment,
      energyCostAdjustment: mod.energyCostAdjustment,
      nullifyGemsCost: mod.nullifyGemsCost,
      addGemCost: listClone(mod.addGemCost),
      gemify: mod.gemify,
      specialAbilities: listClone(mod.specialAbilities),
      fromCardMerge: mod.fromCardMerge,
      deathCardInfo: mod.deathCardInfo,
      decalIds: listClone(mod.decalIds)
    })
    modIndex.value = mods.value.$rlength - 1
  }

  function deleteMod() {
    listRemove(mods.value, modIndex.value)
    if (modIndex.value >= mods.value.$rlength && mods.value.$rlength > 0) {
      modIndex.value = mods.value.$rlength - 1
    }
  }

  defineExpose({ open })
</script>

<style scoped>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 0.5em;
  }
</style>
