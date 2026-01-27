import type { Ref } from 'vue'

export function useCloseOnBackdrop(dialogRef: Ref<HTMLDialogElement | null>) {
  return (event: MouseEvent) => {
    if (event.target === dialogRef.value) {
      dialogRef.value?.close()
    }
  }
}
