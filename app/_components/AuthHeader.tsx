import Link from "next/link"

type Props = {
  subText: string
}

export const AuthHeader = ({ subText }: Props) => {
  return (
    <div className="bg-white px-5 pt-8 pb-6 text-center border-b border-gray-200">
      <Link href="/" className="text-4xl font-bold">
        <span className="text-[#1A56A0]">Snow</span>
        <span className="text-[#378ADD]">Scope</span>
      </Link>
      <p className="text-sm text-[#64748B] mt-2">{subText}</p>
    </div>
  )
}