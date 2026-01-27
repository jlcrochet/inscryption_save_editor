<template>
  <dialog ref=dialogRef @click=closeOnBackdrop>
    <template v-if=mod>
      <table>
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

      <table>
        <table-select
          v-model=mod.abilities.$rcontent
          @change="mod.abilities.$rlength = $event.target.selectedOptions.length"
          :label="`Add (${mod.abilities.$rlength})`"
          help="Sigils to add to the card."
          multiple size=8
        >
          <template v-for="(ability, k) in abilities">
            <option :value="k + 1" :title=ability.description :class=ability.type>{{ ability.name }}</option>
          </template>
        </table-select>

        <table-select
          v-model=mod.negateAbilities.$rcontent
          @change="mod.negateAbilities.$rlength = $event.target.selectedOptions.length"
          :label="`Remove (${mod.negateAbilities.$rlength})`"
          help="Sigils to remove from the card."
          multiple size=8
        >
          <template v-for="(ability, k) in abilities">
            <option :value="k + 1" :title=ability.description :class=ability.type>{{ ability.name }}</option>
          </template>
        </table-select>
      </table>

      <hr />

      <table>
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
          label="Lost eye"
          help="Whether or not the portrait is missing its right eye as a result of using the Special Dagger."
          type=checkbox
        />
      </table>

      <hr />

      <div class=actions>
        <button type=button @click=close>Close</button>
      </div>
    </template>
  </dialog>
</template>

<script setup>
  const dialogRef = ref(null)
  const mod = ref(null)

  function open(deathcardMod) {
    mod.value = deathcardMod
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

  defineExpose({ open })
</script>

<style scoped>
  .actions {
    display: flex;
    justify-content: center;
    gap: 0.5em;
  }

  .unsafe {
    color: Red;
  }

  .dummy {
    color: DarkOrange;
  }
</style>
