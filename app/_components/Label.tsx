import clsx from "clsx"

type Props = React.ComponentPropsWithoutRef<'label'> & {
  children: string
}

export const Label = ({ className, children, htmlFor }: Props) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx('block mb-2 text-sm text-[#64748B]', className)}>
      {children}
    </label>
  )
}