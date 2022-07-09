<template>
  <fieldset>
    <legend>
      <table>
        <tr>
          <template v-for="(slot, i) in $slots">
            <td>
              <template v-if="i == tabIndex">
                <button type=button disabled>{{ titles[i] }}</button>
              </template>

              <template v-else>
                <button type=button @click=setTab(i)>{{ titles[i] }}</button>
              </template>
            </td>
          </template>
        </tr>
      </table>
    </legend>

    <template v-for="(slot, i) in $slots">
      <div v-show="i == tabIndex">
        <slot :name=i />
      </div>
    </template>
  </fieldset>
</template>

<script>
  export default {
      props: ["titles"],

      data() {
          return {
              tabIndex: 0
          }
      },

      methods: {
          setTab(n) {
              if (document.forms.main.reportValidity()) {
                  this.tabIndex = n
              }
          }
      }
  }
</script>
