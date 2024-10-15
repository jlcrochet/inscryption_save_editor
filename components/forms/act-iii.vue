<template>
  <tabs>
    <tab title="Miscellaneous">
      <table cellpadding=4>
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
      <table cellpadding=4>
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
      <table cellpadding=4>
        <tbody>
          <template v-for="(item, i) in saveFile.part3Data.items.$rcontent">
            <tr>
              <td>
                <select v-model=saveFile.part3Data.items.$rcontent[i] required>
                  <template v-for="[gameName, value] in items">
                    <option :value=value>{{ gameName }}</option>
                  </template>
                </select>
              </td>

              <td>
                <button type=button @click='listRemove(saveFile.part3Data.items, i)'>Remove</button>
              </td>
            </tr>
          </template>

          <tr>
            <td>
              <button type=button @click='listAdd(saveFile.part3Data.items, null)'>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </tab>
  </tabs>
</template>

<script setup>
  import { abilities, items } from '~/game-data'
  import { listAdd, listRemove } from '~/utils'

  const saveFile = inject('saveFile')
</script>
