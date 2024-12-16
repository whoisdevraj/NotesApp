import { selectedNoteAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

const FloatingNoteTitle = ({ className, ...props }: ComponentProps<'div'>) => {
  const title = useAtomValue(selectedNoteAtom)

  if (!title) return null

  return (
    <div className={twMerge('flex justify-center', className)} {...props}>
      <span className="text-gray-400">{title.title}</span>
    </div>
  )
}

export default FloatingNoteTitle
