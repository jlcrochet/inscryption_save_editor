<template>
  <table>
    <tbody>
      <tr v-for="(item, i) in itemList.$rcontent" :key=i>
        <td>
          <select v-model=itemList.$rcontent[i] required>
            <template v-for="item in items" :key=item.id>
              <option :value=item.id>{{ item.name }}</option>
            </template>
          </select>
        </td>

        <td>
          <button type=button @click='listRemove(itemList, i)'>Remove</button>
        </td>
      </tr>

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
