<template>
  <fieldset>
    <legend>
      <table>
        <tbody>
          <template v-for="(tab, i) in tabs">
            <td>
              <button type=button :disabled="i == tabIndex" @click=setIndex(i) style='user-select: none'>
                {{ tab.props.title }}
              </button>
            </td>
          </template>
        </tbody>
      </table>
    </legend>

    <keep-alive>
      <component :is=tabs[tabIndex] :key=tabIndex />
    </keep-alive>
  </fieldset>
</template>

<script setup>
  const tabIndex = ref(0)
  const tabs = shallowRef([])

  onMounted(() => tabs.value = useSlots().default())

  function setIndex(i) {
    if (document.forms.main.reportValidity()) {
      tabIndex.value = i
    }
  }
</script>
