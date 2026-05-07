import clsx from "clsx"


type Props = React.ComponentPropsWithoutRef<'button'> & {
  children: string
}

export const Button = ({ className, children, ...props }: Props) => {
  return (
    <button
      {...props}
      className={clsx("w-full text-white bg-[#378ADD] hover:bg-[#1A56A0] font-medium rounded-lg text-sm px-5 py-3 mt-2", className)}
    >
      {children}
    </button>
  )
}