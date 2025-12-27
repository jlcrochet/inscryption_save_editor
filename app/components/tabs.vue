<template>
  <fieldset>
    <legend>
      <button
        v-for="(tab, i) in tabs"
        :key=tab.title
        type=button
        :disabled="i === tabIndex"
        @click=setIndex(i)
      >
        {{ tab.title }}
      </button>
    </legend>

    <slot />
  </fieldset>
</template>

<script setup>
  const tabIndex = ref(0)
  const tabs = ref([])

  provide('tabs', {
    tabs,
    tabIndex,
    register(tab) {
      tabs.value.push(tab)
      return tabs.value.length - 1
    },
    unregister(index) {
      tabs.value.splice(index, 1)
    }
  })

  function setIndex(i)
  {
    if (document.forms.main.reportValidity()) {
      tabIndex.value = i
    }
  }
</script>
