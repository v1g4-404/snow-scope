type Props = {
  label: string,
  value: string,
}

export const LiveInfo = ({ label, value }: Props) => {
  return (
    <div>
      <p className="text-xs text-[#64748B]">{label}</p>
      <p className="text-sm font-medium text-[#1E293B]">{value}</p>
    </div>
  )
}