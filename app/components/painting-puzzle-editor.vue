<template>
  <div>
    <p>
      These represent spaces on the board from left to right:
    </p>

    <table>
      <template v-for="(card, i) in oilPaintingState.puzzleSolution.$rcontent">
        <tr>
          <td>
            <select v-model=oilPaintingState.puzzleSolution.$rcontent[i]>
              <option :value=null>(empty)</option>
              <template v-for="[gameName, value] in cardNames">
                <option :value=value :selected="card == value">{{ gameName }}</option>
              </template>
            </select>
          </td>
        </tr>
      </template>
    </table>

    <hr />

    <table>
      <table-input v-model=oilPaintingState.puzzleSolved type=checkbox label=Solved />
      <table-select v-model.number=oilPaintingState.rewardIndex label=Reward>
        <option value=0>Clover</option>
        <option value=1>Extra Candle</option>
        <option value=2>Bee Statue</option>
      </table-select>
      <table-input v-model=oilPaintingState.rewardTaken type=checkbox label='Reward taken' />
    </table>
  </div>
</template>

<script setup>
  defineProps({
    oilPaintingState: {
      type: Object,
      required: true
    }
  })
</script>
