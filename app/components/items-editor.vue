<template>
  <table>
    <tbody>
      <template v-for="(item, i) in itemList.$rcontent">
        <tr>
          <td>
            <select v-model=itemList.$rcontent[i] required>
              <template v-for="item in items">
                <option :value=item.id>{{ item.name }}</option>
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
