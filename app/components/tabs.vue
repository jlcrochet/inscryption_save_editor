<template>
  <fieldset>
    <legend>
      <button
        v-for="(tab, i) in tabs"
        :key=tab.id
        type=button
        :disabled="tab.id === tabIndex"
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
  let nextId = 0

  provide('tabs', {
    tabs,
    tabIndex,
    register(tab) {
      const id = nextId++
      tabs.value.push({ id, title: tab.title })
      if (tabs.value.length === 1) tabIndex.value = id
      return id
    },
    unregister(id) {
      const index = tabs.value.findIndex(tab => tab.id === id)
      if (index === -1) return
      tabs.value.splice(index, 1)
      if (tabIndex.value === id) {
        tabIndex.value = tabs.value[0]?.id ?? 0
      }
    }
  })

  function setIndex(i)
  {
    const form = document.forms.main
    if (!form || form.reportValidity()) {
      const nextId = tabs.value[i]?.id
      if (nextId !== undefined) tabIndex.value = nextId
    }
  }
</script>
