import { notesMock } from '@renderer/store/mocks'
import { ComponentProps } from 'react'
import { Preview } from '@renderer/components/Preview'
import { twMerge } from 'tailwind-merge'
import { useNotesList } from '@renderer/hooks/useNotesList'
import { isEmpty } from 'lodash'

type NotesPreviewProps = ComponentProps<'ul'> & {
  onSelect?: () => void
}

const NotesPreview = ({ className, onSelect, ...props }: NotesPreviewProps) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({ onSelect })
  if (!notes) return null
  if (isEmpty(notes)) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
        <span>No Notes Yet!</span>
      </ul>
    )
  }

  return (
    <ul className={className} {...props}>
      {notes.map((note, index) => (
        <Preview
          key={note.title + note.lastEditedTime}
          isActive={selectedNoteIndex === index}
          onClick={handleNoteSelect(index)}
          {...note}
        />
      ))}
    </ul>
  )
}

export default NotesPreview
