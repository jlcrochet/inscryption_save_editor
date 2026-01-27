import yamlContent from '~/assets/game-data.yaml?raw'
import { parse } from 'yaml'

type CardType = 'normal' | 'unsafe' | 'dummy'

const data = parse(yamlContent) as {
  cards: Record<string, { name?: string, type?: CardType } | null>
  items: Record<string, { name?: string } | null>
  abilities: { name: string, description: string, type?: CardType }[]
  tribes: string[]
  boons: { name: string, description: string }[]
  eyeStates: string[]
  starterDecks: string[]
}
type CardMap = Record<string, { name?: string, type?: CardType } | null>
type AbilityEntry = { name: string, description: string, type?: CardType }
type IdNameMap = Record<string, { name?: string } | null>

function cardsToSortedArray(map: CardMap): { id: string, name: string, type: CardType }[] {
  return Object.entries(map)
    .map(([id, props]) => ({ id, name: props?.name ?? id, type: props?.type ?? 'normal' }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function abilitiesToArray(abilities: AbilityEntry[]): { name: string, description: string, type: CardType }[] {
  return abilities.map(a => ({ name: a.name, description: a.description, type: a.type ?? 'normal' }))
}

function mapToSortedArray(map: IdNameMap): { id: string, name: string }[] {
  return Object.entries(map)
    .map(([id, props]) => ({ id, name: props?.name ?? id }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const cards: { id: string, name: string, type: CardType }[] = cardsToSortedArray(data.cards)
export const items: { id: string, name: string }[] = mapToSortedArray(data.items)
export const abilities: { name: string, description: string, type: CardType }[] = abilitiesToArray(data.abilities)
export const tribes: string[] = data.tribes
export const boons: { name: string, description: string }[] = data.boons
export const eyeStates: string[] = data.eyeStates
export const starterDecks: string[] = data.starterDecks
