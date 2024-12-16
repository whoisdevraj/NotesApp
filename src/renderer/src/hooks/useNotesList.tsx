import { useAtomValue, useSetAtom } from 'jotai'
import { notesAtom, selectedNoteIndexAtom } from '../store/index'

export const useNotesList = ({ onSelect }: { onSelect?: () => void }) => {
  const notes = useAtomValue(notesAtom) // Read the value of notesAtom
  const selectedNoteIndex = useAtomValue(selectedNoteIndexAtom) // Read the value of selectedNoteIndexAtom
  const setSelectedNoteIndex = useSetAtom(selectedNoteIndexAtom) // Setter for selectedNoteIndexAtom

  const handleNoteSelect = (index: number) => async () => {
    setSelectedNoteIndex(index) // Update the selected note index
    if (onSelect) {
      onSelect() // Call the onSelect callback if provided
    }
  }

  return {
    notes,
    selectedNoteIndex,
    handleNoteSelect
  }
}
