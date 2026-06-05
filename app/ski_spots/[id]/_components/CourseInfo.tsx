type Props = {
  label: string,
  value: string,
}

export const CourseInfo = ({ label, value }: Props) => {
  return (
    <div className="bg-white rounded-xl p-3" >
      <p className="text-xs text-[#64748B]">{label}</p>
      <p className="text-lg font-medium text-[#1E293B]">{value}</p>
    </div >
  )
}