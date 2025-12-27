<template>
  <table>
    <tbody>
      <template v-for="(item, i) in items.$rcontent">
        <tr>
          <td>
            <select v-model=items.$rcontent[i] required>
              <template v-for="[gameName, value] in itemOptions">
                <option :value=value>{{ gameName }}</option>
              </template>
            </select>
          </td>

          <td>
            <button type=button @click='listRemove(items, i)'>Remove</button>
          </td>
        </tr>
      </template>

      <tr>
        <td>
          <button type=button @click='listAdd(items, null)'>Add Item</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  import { items as itemOptions } from '~/game-data'
  import { listAdd, listRemove } from '~/utils'

  defineProps({
    items: {
      type: Object,
      required: true
    }
  })
</script>
