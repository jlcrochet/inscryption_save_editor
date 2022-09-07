<template>
  <table cellpadding=8>
    <thead>
      <tr>
        <th>Name</th>
        <th>Modifications</th>
      </tr>
    </thead>

    <tbody>
      <template v-for="(card, i) in deck.cardIds.$rcontent">
        <tr class=card>
          <td>
            <select :value=card @input="updateCardSelection(i, $event.target.value)" required>
              <template v-for="[gameName, value] in gameData.cardNames">
                <option :value=value>{{ gameName }}</option>
              </template>
            </select>

            <hr />

            <center>
              <table>
                <td>
                  <button type=button @click=duplicateCard(i)>Duplicate</button>
                </td>

                <td>
                  <button type=button @click=removeCard(i)>Remove</button>
                </td>
              </table>
            </center>
          </td>

          <template v-for="(mod, j) in deck.cardIdModInfos.$rcontent[i].$v.$rcontent">
            <td>
              <table cellpadding=2>
                <tr>
                  <td><span title="Changes the displayed name of this card.">Name</span>:</td>
                  <td><input v-model.lazy.trim=mod.nameReplacement maxlength=16 /></td>
                </tr>

                <tr>
                  <td><span title="Adds or subtracts attack points.">Power</span>:</td>
                  <td><input type=number v-model.lazy.number=mod.attackAdjustment /></td>
                </tr>

                <tr>
                  <td><span title="Adds or subtracts health points.">Health</span>:</td>
                  <td><input type=number v-model.lazy.number=mod.healthAdjustment /></td>
                </tr>

                <tr>
                  <td><span title="Modifies the number of sacrifices this card requires to play.">Blood</span>:</td>
                  <td><input type=number v-model.lazy.number=mod.bloodCostAdjustment /></td>
                </tr>

                <tr>
                  <td><span title="Modifies the number of bones this card requires to play.">Bones</span>:</td>
                  <td><input type=number v-model.lazy.number=mod.bonesCostAdjustment /></td>
                </tr>

                <tr>
                  <td><span title="Modifies the amount of energy this card requires to play.">Energy</span>:</td>
                  <td><input type=number v-model.lazy.number=mod.energyCostAdjustment /></td>
                </tr>

                <tr>
                  <td><span title="If true, any gem requirements this card originally had are removed.">Mox nullified</span>:</td>
                  <td><input type=checkbox v-model=mod.nullifyGemsCost /></td>
                </tr>

                <tr>
                  <td><span title="If true, this card is now gemified.">Gemified</span>:</td>
                  <td><input type=checkbox v-model=mod.gemify /></td>
                </tr>

                <tr>
                  <td><span title="If true, this mod occurred as the result of a card merge of some sort, such as the Mysterious Stones or the Mycologists. Determines the appearance of any added sigils as well as whether or not this card can be used in subsequent merges.">Merged</span>:</td>
                  <td><input type=checkbox v-model=mod.fromCardMerge /></td>
                </tr>
              </table>

              <hr />

              <table cellpadding=2>
                <tr>
                  <td><span title="Sigils to add to this card.">Add</span> ({{ mod.abilities.$rlength }}):</td>

                  <td>
                    <select multiple size=8 v-model=mod.abilities.$rcontent @change="mod.abilities.$rlength = $event.target.selectedOptions.length">
                      <template v-for="([ability, description], k) in gameData.abilities">
                        <option :value="k + 1" :title=description>{{ ability }}</option>
                      </template>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td><span title="Sigils to remove from this card.">Remove</span> ({{ mod.negateAbilities.$rlength }}):</td>

                  <td>
                    <select multiple size=8 v-model=mod.negateAbilities.$rcontent @change="mod.negateAbilities.$rlength = $event.target.selectedOptions.length">
                      <template v-for="([ability, description], k) in gameData.abilities">
                        <option :value="k + 1" :title=description>{{ ability }}</option>
                      </template>
                    </select>
                  </td>
                </tr>
              </table>

              <hr />

              <center>
                <button type=button @click="removeMod(i, j)">Remove</button>
              </center>
            </td>
          </template>

          <td>
            <center>
              <button type=button @click=addMod(i)>Add</button>
            </center>
          </td>
        </tr>
      </template>

      <tr class=card>
        <td>
          <center>
            <button type=button @click=addCard>Add</button>
          </center>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
      props: {
          deck: {
              type: Object,
              required: true
          },
          gameData: {
              type: Object,
              required: true
          }
      },

      methods: {
          addCard() {
              this.deck.cardIds.$rcontent.push(null)
              this.deck.cardIds.$rlength += 1

              // Stub mod info for new card
              this.deck.cardIdModInfos.$rcontent.push({
                  $k: "",
                  $v: {
                      $type: "System.Collections.Generic.List`1[[DiskCardGame.CardModificationInfo, Assembly-CSharp]], mscorlib",
                      $rlength: 0,
                      $rcontent: []
                  }
              })

              this.deck.cardIdModInfos.$rlength += 1
          },

          duplicateCard(i) {
              let name
              name = this.deck.cardIds.$rcontent[this.deck.cardIds.$rlength++] = this.deck.cardIds.$rcontent[i]

              let modInfo = this.deck.cardIdModInfos.$rcontent[i]

              this.deck.cardIdModInfos.$rcontent[this.deck.cardIdModInfos.$rlength++] = {
                  $k: modInfo.$k,
                  $v: {
                      $type: modInfo.$v.$type,
                      $rlength: modInfo.$v.$rlength,
                      $rcontent: modInfo.$v.$rcontent.map(mod => {
                          return {
                              $type: mod.$type,
                              nameReplacement: mod.nameReplacement,
                              attackAdjustment: mod.attackAdjustment,
                              healthAdjustment: mod.healthAdjustment,
                              abilities: {
                                  $type: mod.abilities.$type,
                                  $rlength: mod.abilities.$rlength,
                                  $rcontent: [...mod.abilities.$rcontent]
                              },
                              negateAbilities: {
                                  $type: mod.negateAbilities.$type,
                                  $rlength: mod.negateAbilities.$rlength,
                                  $rcontent: [...mod.negateAbilities.$rcontent]
                              },
                              bloodCostAdjustment: mod.bloodCostAdjustment,
                              bonesCostAdjustment: mod.bonesCostAdjustment,
                              energyCostAdjustment: mod.energyCostAdjustment,
                              nullifyGemsCost: mod.nullifyGemsCost,
                              addGemCost: {
                                  $type: mod.addGemCost.$type,
                                  $rlength: mod.addGemCost.$rlength,
                                  $rcontent: [...mod.addGemCost.$rcontent]
                              },
                              gemify: mod.gemify,
                              specialAbilities: {
                                  $type: mod.specialAbilities.$type,
                                  $rlength: mod.specialAbilities.$rlength,
                                  $rcontent: [...mod.specialAbilities.$rcontent]
                              },
                              fromCardMerge: mod.fromCardMerge,
                              deathCardInfo: mod.deathCardInfo,
                              decalIds: {
                                  $type: mod.decalIds.$type,
                                  $rlength: mod.decalIds.$rlength,
                                  $rcontent: [...mod.decalIds.$rcontent]
                              }
                          }
                      })
                  }
              }

              this.refreshModInfoKeys(name)
          },

          removeCard(i) {
              let name = this.deck.cardIds.$rcontent.splice(i, 1)[0]
              this.deck.cardIds.$rlength -= 1

              this.deck.cardIdModInfos.$rcontent.splice(i, 1)
              this.deck.cardIdModInfos.$rlength -= 1

              this.refreshModInfoKeys(name)
          },

          updateCardSelection(i, name) {
              let oldName = this.deck.cardIds.$rcontent[i]

              this.deck.cardIds.$rcontent[i] = name
              this.deck.cardIdModInfos.$rcontent[i].$k = name

              this.refreshModInfoKeys(oldName)
              this.refreshModInfoKeys(name)
          },

          refreshModInfoKeys(name) {
              let search = name + "#"
              let idx = 0

              for (let modInfo of this.deck.cardIdModInfos.$rcontent) {
                  if (modInfo.$k === name || modInfo.$k.startsWith(search)) {
                      modInfo.$k = search + idx++
                  }
              }
          },

          addMod(i) {
              let modInfo = this.deck.cardIdModInfos.$rcontent[i]

              // Stub mod
              modInfo.$v.$rcontent.push({
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
                  energyCostAdjustment: 0,
                  nullifyGemsCost: false,
                  addGemCost: {
                      $type: "System.Collections.Generic.List`1[[DiskCardGame.GemType, Assembly-CSharp]], mscorlib",
                      $rlength: 0,
                      $rcontent: []
                  },
                  gemify: false,
                  specialAbilities: {
                      $type: "System.Collections.Generic.List`1[[DiskCardGame.SpecialTriggeredAbility, Assembly-CSharp]], mscorlib",
                      $rlength: 0,
                      $rcontent: []
                  },
                  fromCardMerge: false,
                  deathCardInfo: null,
                  decalIds: {
                      $type: "System.Collections.Generic.List`1[[System.String, mscorlib]], mscorlib",
                      $rlength: 0,
                      $rcontent: []
                  }
              })

              modInfo.$v.$rlength += 1
          },

          removeMod(i, j) {
              let modInfo = this.deck.cardIdModInfos.$rcontent[i]

              modInfo.$v.$rcontent.splice(j, 1)
              modInfo.$v.$rlength -= 1
          }
      }
  }
</script>
