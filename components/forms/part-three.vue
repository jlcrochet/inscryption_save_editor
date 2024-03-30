<template>
  <tabs>
    <tab title="Miscellaneous">
      <table cellpadding=2>
        <tr>
          <td>Currency:</td>
          <td><input type=number v-model.lazy.number=saveFile.part3Data.currency min=0 max=999 required /></td>
        </tr>

        <tr>
          <td>Bounty:</td>
          <td><input type=number v-model.lazy.number=saveFile.part3Data.bounty min=0 required /></td>
        </tr>

        <tr>
          <td>Pelts:</td>
          <td><input type=number v-model.lazy.number=saveFile.part3Data.pelts min=0 required /></td>
        </tr>
      </table>
    </tab>

    <tab title="Deck">
      <deck-editor :deck=saveFile.part3Data.deck />
    </tab>

    <tab title="Side Deck">
      <table cellpadding=2>
        <tr>
          <td>Sigils ({{ saveFile.part3Data.sideDeckAbilities.$rlength }}):</td>
          <td>
            <select multiple size=8 v-model=saveFile.part3Data.sideDeckAbilities.$rcontent @change="saveFile.part3Data.sideDeckAbilities.$rlength = $event.target.selectedOptions.length">
              <template v-for="([ability, description], k) in abilities">
                <option :value="k + 1" :title=description>{{ ability }}</option>
              </template>
            </select>
          </td>
        </tr>
      </table>
    </tab>

    <tab title="Items">
      <table cellpadding=2>
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
  </tabs>
</template>

<script setup>
  import { abilities, items } from '~/game-data'

  const saveFile = useState('saveFile')

  function addItem() {
      saveFile.value.part3Data.items.$rcontent.push(null)
      saveFile.value.part3Data.items.$rlength += 1
  }

  function removeItem(i) {
      saveFile.value.part3Data.items.$rcontent.splice(i, 1)
      saveFile.value.part3Data.items.$rlength -= 1
  }
</script>
