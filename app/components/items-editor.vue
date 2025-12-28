<template>
  <table>
    <tbody>
      <template v-for="(item, i) in itemList.$rcontent">
        <tr>
          <td>
            <select v-model=itemList.$rcontent[i] required>
              <template v-for="[gameName, value] in items">
                <option :value=value>{{ gameName }}</option>
              </template>
            </select>
          </td>

          <td>
            <button type=button @click='listRemove(itemList, i)'>Remove</button>
          </td>
        </tr>
      </template>

      <tr>
        <td>
          <button type=button @click='listAdd(itemList, null)'>Add Item</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  defineProps({
    itemList: {
      type: Object,
      required: true
    }
  })
</script>
