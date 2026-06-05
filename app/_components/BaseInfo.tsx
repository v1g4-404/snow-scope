type Props = {
  label: string,
  value: string,
}

export const BaseInfo = ({ label, value }: Props) => {
  return (
    <div className="flex justify-between">
      <p className="text-xs text-[#64748B]">{label}</p>
      <p className="text-xs text-[#1E293B]">{value}</p>
    </div>
  )
}