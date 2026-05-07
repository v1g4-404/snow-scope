import clsx from "clsx"
import React from "react"

type Props = React.ComponentPropsWithoutRef<'input'> & {
  type: string
  id: string
}

export const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      className={clsx('bg-white border border-[#CBD5E1] text-gray-900 text-sm rounded-lg block w-full p-2.5', className)}
    />
  )
)

TextInput.displayName = 'TextInput'