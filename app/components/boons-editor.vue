<template>
  <table>
    <tr v-for="(boon, i) in boons" :key="i">
      <td>
        <label :for="'boon-' + i">
          <span :title="boon.description">{{ boon.name }}</span>
        </label>
      </td>
      <td>
        <input
          :id="'boon-' + i"
          type="checkbox"
          :checked="boonIds.$rcontent.includes(i + 1)"
          @change="toggleBoon(i + 1, $event.target.checked)"
        />
      </td>
    </tr>
  </table>
</template>

<script setup>
  const props = defineProps({
    boonIds: {
      type: Object,
      required: true
    }
  })

  function toggleBoon(boonId, checked) {
    const index = props.boonIds.$rcontent.indexOf(boonId)
    if (checked && index === -1) {
      listAdd(props.boonIds, boonId)
    } else if (!checked && index !== -1) {
      listRemove(props.boonIds, index)
    }
  }
</script>
