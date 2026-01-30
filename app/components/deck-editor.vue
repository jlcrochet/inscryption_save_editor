<template>
  <table>
    <thead>
      <tr>
        <th style="text-align: right">#</th>
        <th>Name</th>
        <th style="text-align: right">Mods</th>
        <th></th>
      </tr>
    </thead>

    <tbody
      ref=tbodyRef
      @dragover.prevent="dragOverRow"
      @dragenter.prevent="dragOverRow"
      @drop.prevent="dropOnRow"
    >
      <tr
        v-for="card in paginatedCards"
        :key=card.index
        :data-index=card.index
        class=deck-row
        draggable=true
        :class="{
          dragging: dragIndex === card.index,
          'drag-over-before': dragOverIndex === card.index && !dragOverAfter,
          'drag-over-after': dragOverIndex === card.index && dragOverAfter
        }"
        @dragstart="startDrag(card.index, $event)"
        @dragend=endDrag
      >
        <td style="text-align: right">{{ card.index + 1 }}</td>

        <td>
          <select :value=card.name @input="updateCardSelection(card.index, $event.target.value)" :class="getCardType(card.name)" required>
            <option v-for="c in cards" :key=c.id :value=c.id :class="c.type">{{ c.name }}</option>
          </select>
        </td>

        <td style="text-align: right">
          {{ card.modCount }}
        </td>

        <td class=actions>
          <button type=button @click=openModDialog(card.index)>Edit Mods</button>
          <button type=button @click=duplicateCard(card.index)>Duplicate</button>
          <button type=button @click=deleteCard(card.index)>Delete</button>
        </td>
      </tr>

      <tr
        :data-index=totalCards
        :class="{
          'drag-over-before': dragOverIndex === totalCards && !dragOverAfter,
          'drag-over-after': dragOverIndex === totalCards && dragOverAfter
        }"
      >
        <td></td>
        <td>
          <button type=button @click=addCard>Add Card</button>
        </td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <div v-if="totalPages > 1" class=pagination>
    <button type=button @click=prevPage :disabled="page === 0">&lt</button>
    <span>{{ page + 1 }} / {{ totalPages }}</span>
    <button type=button @click=nextPage :disabled="page === totalPages - 1">&gt</button>
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
</template>

<script setup>
  import { cards, cardTypes } from '~/utils/game-data'

  const props = defineProps({
    deck: {
      type: Object,
      required: true
    }
  })

  const page = ref(0)
  const pageSize = ref(20)
  const modDialogRef = ref(null)
  const tbodyRef = ref(null)
  const dragIndex = ref(null)
  const dragOverIndex = ref(null)
  const dragOverAfter = ref(false)

  function getCardType(cardId) {
    return cardTypes.get(cardId) ?? 'normal'
  }

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
        modCount: props.deck.cardIdModInfos.$rcontent[i]?.$v?.$rlength ?? 0
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
    const modInfo = props.deck.cardIdModInfos.$rcontent[i]
    if (!modInfo?.$v) return
    modDialogRef.value.open(modInfo.$v)
  }

  function parseKeyIndex(key) {
    if (typeof key !== 'string') return null
    const hash = key.lastIndexOf('#')
    if (hash === -1) return null
    const value = Number(key.slice(hash + 1))
    return Number.isFinite(value) ? value : null
  }

  function rebuildModKeys() {
    const modInfos = props.deck.cardIdModInfos?.$rcontent
    const cardIds = props.deck.cardIds?.$rcontent
    if (!modInfos || !cardIds) return

    let lastIndex = -1
    const limit = Math.min(modInfos.length, cardIds.length)
    for (let i = 0; i < limit; i++) {
      const modInfo = modInfos[i]
      if (!modInfo) continue
      const existingIndex = parseKeyIndex(modInfo.$k)
      const nextIndex = existingIndex === null || existingIndex <= lastIndex
        ? lastIndex + 1
        : existingIndex
      lastIndex = nextIndex
      const name = cardIds[i] ?? ''
      modInfo.$k = `${name}#${nextIndex}`
    }
  }

  function addCard() {
    listAdd(props.deck.cardIds, null)
    listAdd(props.deck.cardIdModInfos, {
      $k: '',
      $v: listNew('DiskCardGame.CardModificationInfo')
    })
    rebuildModKeys()
    nextTick(gotoLastPageAndFocus)
  }

  function gotoLastPage() {
    page.value = totalPages.value - 1
  }

  function gotoLastPageAndFocus() {
    gotoLastPage()
    nextTick(() => {
      const rows = tbodyRef.value.children
      const lastCardRow = rows[rows.length - 2] // -2 because last row is the "Add Card" button row
      const select = lastCardRow?.cells[1]?.firstElementChild
      select?.focus()
    })
  }

  function moveList(list, fromIndex, toIndex) {
    const content = list?.$rcontent
    if (!content) return
    if (fromIndex === toIndex) return
    if (fromIndex < 0 || fromIndex >= content.length) return
    const clamped = Math.max(0, Math.min(toIndex, content.length))
    const [item] = content.splice(fromIndex, 1)
    content.splice(clamped, 0, item)
  }

  function moveCard(fromIndex, toIndex) {
    if (fromIndex === toIndex) return
    const cardIds = props.deck.cardIds?.$rcontent
    const modInfos = props.deck.cardIdModInfos?.$rcontent
    if (!cardIds || !modInfos) return
    const limit = Math.min(cardIds.length, modInfos.length)
    if (fromIndex < 0 || fromIndex >= limit) return
    const clampedTo = Math.max(0, Math.min(toIndex, limit))
    const targetIndex = clampedTo > fromIndex ? clampedTo - 1 : clampedTo
    moveList(props.deck.cardIds, fromIndex, targetIndex)
    moveList(props.deck.cardIdModInfos, fromIndex, targetIndex)
    rebuildModKeys()
  }

  function duplicateCard(i) {
    const name = props.deck.cardIds.$rcontent[i]
    const modInfo = props.deck.cardIdModInfos.$rcontent[i]

    listAdd(props.deck.cardIds, name)
    listAdd(props.deck.cardIdModInfos, {
      $k: '',
      $v: {
        $type: modInfo.$v.$type,
        $rlength: modInfo.$v.$rlength,
        $rcontent: modInfo.$v.$rcontent.map(cloneMod)
      }
    })

    rebuildModKeys()
    nextTick(gotoLastPage)
  }

  function deleteCard(i) {
    listRemove(props.deck.cardIds, i)
    listRemove(props.deck.cardIdModInfos, i)
    rebuildModKeys()
  }

  function updateCardSelection(i, name) {
    props.deck.cardIds.$rcontent[i] = name
    rebuildModKeys()
  }

  function isInteractiveTarget(target) {
    return target?.closest?.('input, select, button, textarea, option')
  }

  function startDrag(i, event) {
    if (isInteractiveTarget(event?.target)) {
      event.preventDefault()
      return
    }
    dragIndex.value = i
    dragOverIndex.value = i
    dragOverAfter.value = false
    if (event?.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(i))
    }
  }

  function getRowHit(event) {
    if (!event) return null
    const path = event.composedPath?.() ?? []
    for (const el of path) {
      if (el?.dataset?.index !== undefined) {
        const index = Number(el.dataset.index)
        if (Number.isFinite(index)) return { row: el, index }
      }
    }

    const target = event.target
    if (target?.closest) {
      const row = target.closest('tr[data-index]')
      if (row) {
        const index = Number(row.dataset.index)
        if (Number.isFinite(index)) return { row, index }
      }
    }

    if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
      const el = document.elementFromPoint(event.clientX, event.clientY)
      const row = el?.closest?.('tr[data-index]')
      if (row) {
        const index = Number(row.dataset.index)
        if (Number.isFinite(index)) return { row, index }
      }
    }

    return null
  }

  function dragOverRow(event) {
    if (dragIndex.value === null) return
    const hit = getRowHit(event)
    if (!hit) return
    dragOverIndex.value = hit.index
    const rect = hit.row.getBoundingClientRect()
    dragOverAfter.value = event.clientY > rect.top + rect.height / 2
    if (event?.dataTransfer) event.dataTransfer.dropEffect = 'move'
  }

  function dropOnRow(event) {
    if (dragIndex.value === null) return
    const hit = getRowHit(event)
    if (hit) {
      dragOverIndex.value = hit.index
      const rect = hit.row.getBoundingClientRect()
      dragOverAfter.value = event.clientY > rect.top + rect.height / 2
    }
    if (dragOverIndex.value === null) return
    const target = dragOverAfter.value ? dragOverIndex.value + 1 : dragOverIndex.value
    moveCard(dragIndex.value, target)
    endDrag()
  }

  function endDrag() {
    dragIndex.value = null
    dragOverIndex.value = null
    dragOverAfter.value = false
  }
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

  .deck-row {
    cursor: grab;
  }

  .deck-row:hover {
    background-color: #e2e8f0;
  }

  .deck-row :is(input, select, button, textarea) {
    cursor: auto;
  }

  tr.dragging {
    opacity: 0.5;
  }

  tr.drag-over-before > td {
    border-top: 2px solid #333;
  }

  tr.drag-over-after > td {
    border-bottom: 2px solid #333;
  }

  option.normal {
    color: initial;
  }

  option.unsafe,
  option.dummy {
    color: inherit;
  }
</style>
