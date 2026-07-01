interface Props {
  label: string
  value: number
}

export const StatCard: React.FC<Props> = ({ label, value }) => (
  <div className="bg-[#E2E8F0] rounded-xl py-5 px-3 text-center">
    <p className="text-xs text-[#64748B] mb-2">{label}</p>
    <p className="text-3xl font-medium text-[#1E293B]">{value}</p>
  </div>
)