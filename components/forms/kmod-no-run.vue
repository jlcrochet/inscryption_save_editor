<template>
  <tab-list :titles="['Miscellaneous', 'Conquered Starter Decks']">
    <template #0>
      <table cellpadding=2>
        <tr>
          <td>Challenge level:</td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.challengeLevel min=0 required /></td>
        </tr>

        <tr>
          <td><span title="If 0, your deck will start with two Rabbit Pelts; if 1, your deck will start with an Opossum and a Rabbit Pelt; else, your deck will start with an Opossum and a Ring Worm.">Runs since first boss was reached</span>:</td>
          <td><input type=number v-model.lazy.number=saveFile.ascensionData.numRunsSinceReachedFirstBoss min=0 required /></td>
        </tr>
      </table>
    </template>

    <template #1>
      <table cellpadding=2>
        <template v-for="deck in gameData.starterDecks">
          <tr>
            <td>{{ deck }}</td>
            <td>
              <input type=checkbox
                     :value=deck
                     :checked=saveFile.ascensionData.conqueredStarterDecks.$rcontent.includes(deck)
                     @change="toggleStarterDeck(deck, $event.target.checked)" />
            </td>
          </tr>
        </template>
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
          toggleStarterDeck(name, checked) {
              if (checked) {
                  this.saveFile.ascensionData.conqueredStarterDecks.$rcontent.push(name)
                  this.saveFile.ascensionData.conqueredStarterDecks.$rlength += 1
              } else {
                  let idx = this.saveFile.ascensionData.conqueredStarterDecks.$rcontent.indexOf(name)

                  this.saveFile.ascensionData.conqueredStarterDecks.$rcontent.splice(idx, 1)
                  this.saveFile.ascensionData.conqueredStarterDecks.$rlength -= 1
              }
          }
      }
  }
</script>
