<template>
  <table>
    <table-select
      v-model=totemTops.$rcontent
      @change="totemTops.$rlength = $event.target.selectedOptions.length"
      :label="`Tribes (${totemTops.$rlength})`"
      help="Which totem heads you have."
      multiple size=6
    >
    <template v-for='(tribe, i) in tribes' :key="i + 1">
      <option :value="i + 1">{{ tribe }}</option>
    </template>
    </table-select>

    <table-select
      v-model=totemBottoms.$rcontent
      @change="totemBottoms.$rlength = $event.target.selectedOptions.length"
      :label="`Sigils (${totemBottoms.$rlength})`"
      help="Which totem bodies you have."
      multiple size=10
    >
    <template v-for="(ability, i) in abilities" :key="i + 1">
      <option :value="i + 1" :title=ability.description :class=ability.type>{{ ability.name }}</option>
    </template>
    </table-select>

  </table>

  <template v-if='totems.$rlength > 0'>
    <hr>

    Selected:
    <select v-model=totems.$rcontent[0].tribe label=Head required>
    <template v-for="i in totemTops.$rcontent" :key=i>
      <option :value=i>{{ tribes[i - 1] }}</option>
    </template>
    </select>
    +
    <select v-model=totems.$rcontent[0].ability label=Body required :class=getAbilityType(totems.$rcontent[0].ability)>
    <template v-for="i in totemBottoms.$rcontent" :key=i>
      <option :value=i :title='abilities[i - 1].description' :class='abilities[i - 1].type'>{{ abilities[i - 1].name }}</option>
    </template>
    </select>
  </template>
</template>

<script setup>
  import { abilities } from '~/utils/game-data'

  function getAbilityType(abilityIndex) {
    if (!abilityIndex) return 'normal'
    return abilities[abilityIndex - 1]?.type ?? 'normal'
  }

  const props = defineProps({
    totemTops: {
      type: Object,
      required: true
    },
    totemBottoms: {
      type: Object,
      required: true
    },
    totems: {
      type: Object,
      required: true
    }
  })

  watch(
    [
      () => props.totemTops.$rcontent,
      () => props.totemBottoms.$rcontent
    ],
    ([top, bottom]) => {
      if (top.length > 0 && bottom.length > 0) {
        if (props.totems.$rlength == 0) {
          listAdd(props.totems, {
            $type: typeNameWithAssembly('DiskCardGame.TotemDefinition'),
            tribe: null,
            ability: null
          })
        }

        props.totems.$rcontent[0].tribe = top[0]
        props.totems.$rcontent[0].ability = bottom[0]
      } else {
        if (props.totems.$rlength > 0) {
          listClear(props.totems)
        }
      }
    }
  )
</script>
