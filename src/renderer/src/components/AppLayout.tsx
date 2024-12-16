import { twMerge } from 'tailwind-merge'
import { ComponentProps, forwardRef } from 'react'

export const RootLayout = ({ className, children, ...props }: ComponentProps<'main'>) => {
  return (
    <main className={twMerge('flex felx-row h-screen', className)} {...props}>
      {children}
    </main>
  )
}

export const SideBar = ({ className, children, ...props }: ComponentProps<'aside'>) => {
  return (
    <aside
      className={twMerge('w-[250px] mt-3 h-[calc(100vh+10px)] overflow-auto', className)}
      {...props}
    >
      {children}
    </aside>
  )
}

export const Content = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={twMerge('flex-1 overflow-auto', className)} {...props}>
      {children}
    </div>
  )
)
