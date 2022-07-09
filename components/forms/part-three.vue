<template>
  <tab-list :titles="['Miscellaneous', 'Deck', 'Side Deck', 'Items']">
    <template #0>
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
    </template>

    <template #1>
      <deck-editor :deck=saveFile.part3Data.deck :game-data=gameData />
    </template>

    <template #2>
      <table cellpadding=2>
        <tr>
          <td>Sigils ({{ saveFile.part3Data.sideDeckAbilities.$rlength }}):</td>
          <td>
            <select multiple size=10 v-model=saveFile.part3Data.sideDeckAbilities.$rcontent @change="saveFile.part3Data.sideDeckAbilities.$rlength = $event.target.selectedOptions.length">
              <template v-for="([ability, description], k) in gameData.abilities">
                <option :value="k + 1" :title=description>{{ ability }}</option>
              </template>
            </select>
          </td>
        </tr>
      </table>
    </template>

    <template #3>
      <table cellpadding=2>
        <template v-for="(item, i) in saveFile.part3Data.items.$rcontent">
          <tr>
            <td>
              <select v-model=saveFile.part3Data.items.$rcontent[i] required>
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

      methods: {
          addItem() {
              this.saveFile.part3Data.items.$rcontent.push(null)
              this.saveFile.part3Data.items.$rlength += 1
          },

          removeItem(i) {
              this.saveFile.part3Data.items.$rcontent.splice(i, 1)
              this.saveFile.part3Data.items.$rlength -= 1
          }
      }
  }
</script>
