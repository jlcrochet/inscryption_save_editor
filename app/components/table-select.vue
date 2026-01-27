<template>
  <tr>
    <td>
      <label :for=id>
        <template v-if=help>
          <span :title=help>{{ label }}</span>
        </template>

        <template v-else>
          {{ label }}
        </template>
      </label>
    </td>

    <td>
      <select :id=id v-model.lazy=model v-bind=$attrs>
        <slot />
      </select>
    </td>
  </tr>
</template>

<script setup>
  const id = useId()

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
