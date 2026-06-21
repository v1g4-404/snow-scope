interface Props {
  label: string
  value: string
}

export const WeatherInfoCard: React.FC<Props> = ({ label, value }) => (
  <div className="bg-white rounded-lg p-3 text-center">
    <p className="text-xs text-[#64748B] mb-1">{label}</p>
    <p className="text-lg font-medium text-[#1E293B]">{value}</p>
  </div>
)