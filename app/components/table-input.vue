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
      <input ref=inputRef :id=id v-model.lazy=model v-bind=$attrs>
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

  const inputRef = ref(null)

  function focus() {
    inputRef.value?.focus()
  }

  defineExpose({ focus })
</script>
