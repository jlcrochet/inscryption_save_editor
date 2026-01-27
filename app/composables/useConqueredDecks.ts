export function useConqueredDecks(saveFile: Ref<any>) {
  function toggleConqueredDeck(deck: string, checked: boolean) {
    const list = saveFile.value.ascensionData.conqueredStarterDecks
    const index = list.$rcontent.indexOf(deck)
    if (checked && index === -1) {
      listAdd(list, deck)
    } else if (!checked && index !== -1) {
      listRemove(list, index)
    }
  }

  return { toggleConqueredDeck }
}
