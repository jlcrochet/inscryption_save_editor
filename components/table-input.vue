<template>
  <tr>
    <td>
      <label :for=id style='user-select: none'>
        <template v-if=help>
          <span :title=help>{{ label }}</span>
        </template>

        <template v-else>
          {{ label }}
        </template>
      </label>
    </td>

    <td><input :id=id v-model.lazy=model v-bind=$attrs /></td>
  </tr>
</template>

<script setup>
  import { v4 as uuidv4 } from 'uuid'

  const id = ref(uuidv4())

  defineOptions({
    inheritAttrs: false
  })

  const model = defineModel()

  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    help: {
      type: String
    }
  })
</script>
