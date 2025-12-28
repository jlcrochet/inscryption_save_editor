<template>
  <tabs>
    <tab title="Miscellaneous">
      <table>
        <table-input
          v-model.number=saveFile.part3Data.currency
          label=Currency
          type=number min=0 max=999 required
        />
        <table-input
          v-model.number=saveFile.part3Data.bounty
          label=Bounty
          type=number min=0 required
        />
        <table-input
          v-model.number=saveFile.part3Data.pelts
          label=Pelts
          type=number min=0 required
        />
      </table>
    </tab>

    <tab title="Deck">
      <deck-editor :deck=saveFile.part3Data.deck />
    </tab>

    <tab title="Side Deck">
      <table>
        <table-select
          v-model=saveFile.part3Data.sideDeckAbilities.$rcontent
          :label='`Sigils (${saveFile.part3Data.sideDeckAbilities.$rlength})`'
          @change="saveFile.part3Data.sideDeckAbilities.$rlength = $event.target.selectedOptions.length"
          multiple size=10
        >
          <template v-for="([ability, description], k) in abilities">
            <option :value="k + 1" :title=description>{{ ability }}</option>
          </template>
        </table-select>
      </table>
    </tab>

    <tab title="Items">
      <items-editor :itemList=saveFile.part3Data.items />
    </tab>
  </tabs>
</template>

<script setup>
  const saveFile = inject('saveFile')
</script>
