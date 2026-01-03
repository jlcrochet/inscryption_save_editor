<template>
  <table>
    <tbody>
      <tr>
        <td v-for="(card, i) in oilPaintingState.puzzleSolution.$rcontent">
          <select v-model=oilPaintingState.puzzleSolution.$rcontent[i]>
            <option :value=null>(empty)</option>
            <template v-for="cardName in cards">
              <option :value=cardName.id :selected="card == cardName.id">{{ cardName.name }}</option>
            </template>
          </select>
        </td>
      </tr>
    </tbody>
  </table>

  <table>
    <tbody>
      <table-input v-model=oilPaintingState.puzzleSolved type=checkbox label=Solved />
      <table-select v-model.number=oilPaintingState.rewardIndex label=Reward>
        <option value=0>Clover</option>
        <option value=1>Extra Candle</option>
        <option value=2>Bee Statue</option>
      </table-select>
      <table-input v-model=oilPaintingState.rewardTaken type=checkbox label='Reward taken' />
    </tbody>
  </table>
</template>

<script setup>
  defineProps({
    oilPaintingState: {
      type: Object,
      required: true
    }
  })
</script>
