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
              <template v-for="[gameName, value] in cardNames">
                <option :value=value>{{ gameName }}</option>
              </template>
            </select>

            <hr />

            <center>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button type=button @click=duplicateCard(i)>Duplicate</button>
                    </td>

                    <td>
                      <button type=button @click=removeCard(i)>Remove</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </center>
          </td>

          <template v-for="(mod, j) in deck.cardIdModInfos.$rcontent[i].$v.$rcontent">
            <td>
              <table cellpadding=4>
                <table-input
                  v-model.trim=mod.nameReplacement
                  label=Name
                  help="Changes the displayed name of this card."
                  maxlength=16
                />
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
                  help="Increases or decreases the number of sacrifices this card requires to play."
                  type=number
                />
                <table-input
                  v-model.number=mod.bonesCostAdjustment
                  label=Bones
                  help="Increases or decreases the number of bones this card requires to play."
                  type=number
                />
                <table-input
                  v-model.number=mod.energyCostAdjustment
                  label=Energy
                  help="Increases or decreases the amount of energy this card requires to play."
                  type=number
                />
                <table-input
                  v-model=mod.nullifyGemsCost
                  label='Mox nullified'
                  help="If true, any gem requirements this card originally had are removed."
                  type=checkbox
                />
                <table-input
                  v-model.number=mod.gemify
                  label=Gemified
                  help="If true, this card is now gemified."
                  type=checkbox
                />
                <table-input
                  v-model.number=mod.fromCardMerge
                  label=Merged
                  help="If true, this mod occurred as the result of a card merge of some sort, such as the Mysterious Stones or the Mycologists. Determines the appearance of any added sigils as well as whether or not this card can be used in subsequent merges."
                  type=checkbox
                />
              </table>

              <hr />

              <table cellpadding=4>
                <table-select
                  v-model=mod.abilities.$rcontent
                  @change="mod.abilities.$rlength = $event.target.selectedOptions.length"
                  :label='`Add (${mod.abilities.$rlength})`'
                  help="Sigils to add to this card."
                  multiple size=8
                >
                  <template v-for="([ability, description], k) in abilities">
                    <option :value="k + 1" :title=description>{{ ability }}</option>
                  </template>
                </table-select>

                <table-select
                  v-model=mod.negateAbilities.$rcontent
                  @change="mod.negateAbilities.$rlength = $event.target.selectedOptions.length"
                  :label='`Remove (${mod.negateAbilities.$rlength})`'
                  help="Sigils to remove from this card."
                  multiple size=8
                >
                  <template v-for="([ability, description], k) in abilities">
                    <option :value="k + 1" :title=description>{{ ability }}</option>
                  </template>
                </table-select>
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

<script setup>
  import { cardNames, abilities } from '~/game-data'
  import { listAdd, listRemove } from '~/utils'

  const props = defineProps({
    deck: {
      type: Object,
      required: true
    }
  })

  function addCard() {
    listAdd(props.deck.cardIds, null)

    // Stub mod info for new card
    listAdd(props.deck.cardIdModInfos, {
      $k: "",
      $v: {
        $type: "System.Collections.Generic.List`1[[DiskCardGame.CardModificationInfo, Assembly-CSharp]], mscorlib",
        $rlength: 0,
        $rcontent: []
      }
    })
  }

  async function duplicateCard(i) {
    let name = props.deck.cardIds.$rcontent[i]

    listAdd(props.deck.cardIds, name)

    let modInfo = props.deck.cardIdModInfos.$rcontent[i]

    listAdd(props.deck.cardIdModInfos, {
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
    })

    refreshModInfoKeys(name)
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
  }

  function removeCard(i) {
    let name = props.deck.cardIds.$rcontent.splice(i, 1)[0]
    props.deck.cardIds.$rlength -= 1

    listRemove(props.deck.cardIdModInfos, i)

    refreshModInfoKeys(name)
  }

  function updateCardSelection(i, name) {
    let oldName = props.deck.cardIds.$rcontent[i]

    props.deck.cardIds.$rcontent[i] = name
    props.deck.cardIdModInfos.$rcontent[i].$k = name

    refreshModInfoKeys(oldName)
    refreshModInfoKeys(name)
  }

  function refreshModInfoKeys(name) {
    let search = name + "#"
    let idx = 0

    for (let modInfo of props.deck.cardIdModInfos.$rcontent) {
      if (modInfo.$k == name || modInfo.$k.startsWith(search)) {
        modInfo.$k = search + idx++
      }
    }
  }

  function addMod(i) {
    // Stub mod
    listAdd(props.deck.cardIdModInfos.$rcontent[i].$v, {
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
  }

  function removeMod(i, j) {
    listRemove(props.deck.cardIdModInfos.$rcontent[i].$v, j)
  }
</script>
