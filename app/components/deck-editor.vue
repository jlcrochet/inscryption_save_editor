<template>
  <div>
    <table>
      <thead>
        <tr>
          <th style="text-align: right">#</th>
          <th>Name</th>
          <th style="text-align: right">Mods</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <template v-for="card in paginatedCards">
          <tr>
            <td style="text-align: right">{{ card.index + 1 }}</td>

            <td>
              <select :value=card.name @input="updateCardSelection(card.index, $event.target.value)" required>
                <template v-for="[gameName, value] in cardNames">
                  <option :value=value>{{ gameName }}</option>
                </template>
              </select>
            </td>

            <td style="text-align: right">
              {{ card.modCount }}
            </td>

            <td class=actions>
              <button type=button @click="openModDialog(card.index)">Edit Mods</button>
              <button type=button @click=duplicateCard(card.index)>Duplicate</button>
              <button type=button @click=deleteCard(card.index)>Delete</button>
            </td>
          </tr>
        </template>

        <tr>
          <td colspan=4>
            <button type=button @click=addCard>Add Card</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="totalPages > 1" class=pagination>
      <button type=button @click=prevPage :disabled="page === 0">&lt;</button>
      <span>{{ page + 1 }} / {{ totalPages }}</span>
      <button type=button @click=nextPage :disabled="page === totalPages - 1">&gt;</button>
    </div>

    <div class=page-size>
      <label>
        Per page:
        <select v-model.number=pageSize>
          <option :value=10>10</option>
          <option :value=20>20</option>
          <option :value=50>50</option>
          <option :value=100>100</option>
        </select>
      </label>
    </div>

    <card-mod-dialog ref=modDialogRef />
  </div>
</template>

<script setup>
  const props = defineProps({
    deck: {
      type: Object,
      required: true
    }
  })

  const page = ref(0)
  const pageSize = ref(20)
  const modDialogRef = ref(null)

  const totalCards = computed(() => props.deck.cardIds.$rlength)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalCards.value / pageSize.value)))

  const paginatedCards = computed(() => {
    const start = page.value * pageSize.value
    const end = Math.min(start + pageSize.value, totalCards.value)
    const cards = []

    for (let i = start; i < end; i++) {
      cards.push({
        index: i,
        name: props.deck.cardIds.$rcontent[i],
        modCount: props.deck.cardIdModInfos.$rcontent[i].$v.$rlength
      })
    }

    return cards
  })

  watch(totalPages, (newTotal) => {
    if (page.value >= newTotal) {
      page.value = Math.max(0, newTotal - 1)
    }
  })

  function prevPage() {
    if (page.value > 0) page.value--
  }

  function nextPage() {
    if (page.value < totalPages.value - 1) page.value++
  }

  function openModDialog(i) {
    modDialogRef.value.open(props.deck.cardIdModInfos.$rcontent[i].$v)
  }

  function addCard() {
    listAdd(props.deck.cardIds, null)

    listAdd(props.deck.cardIdModInfos, {
      $k: "",
      $v: listNew("DiskCardGame.CardModificationInfo")
    })

    nextTick(gotoLastPage)
  }

  function gotoLastPage() {
    page.value = totalPages.value - 1
  }

  function duplicateCard(i) {
    const name = props.deck.cardIds.$rcontent[i]
    listAdd(props.deck.cardIds, name)

    const modInfo = props.deck.cardIdModInfos.$rcontent[i]

    listAdd(props.deck.cardIdModInfos, {
      $k: name + '#' + props.deck.cardIdModInfos.$rlength,
      $v: {
        $type: modInfo.$v.$type,
        $rlength: modInfo.$v.$rlength,
        $rcontent: modInfo.$v.$rcontent.map(mod => {
          return {
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
            decalIds: listClone(mod.decalIds),
          }
        })
      }
    })

    // refreshModInfoKeys(name)

    nextTick(gotoLastPage)
  }

  function deleteCard(i) {
    const name = props.deck.cardIds.$rcontent.splice(i, 1)[0]

    props.deck.cardIds.$rlength -= 1
    listRemove(props.deck.cardIdModInfos, i)
    // refreshModInfoKeys(name)
  }

  function updateCardSelection(i, name) {
    // const oldName = props.deck.cardIds.$rcontent[i]

    props.deck.cardIds.$rcontent[i] = name
    props.deck.cardIdModInfos.$rcontent[i].$k = name + '#' + i
    // refreshModInfoKeys(oldName)
    // refreshModInfoKeys(name)
  }

  // function refreshModInfoKeys(name) {
  //   const search = name + "#"
  //   let idx = 0

  //   for (const modInfo of props.deck.cardIdModInfos.$rcontent) {
  //     if (modInfo.$k == name || modInfo.$k.startsWith(search)) {
  //       modInfo.$k = search + idx++
  //     }
  //   }
  // }
</script>

<style scoped>
  .pagination, .page-size {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    margin-top: 0.5em;
  }

  .actions {
    display: flex;
    gap: 0.5em;
  }
</style>
