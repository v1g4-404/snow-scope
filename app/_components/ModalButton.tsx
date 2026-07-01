interface Props {
  variant: 'cancel' | 'confirm' | 'delete'
  label: string
  onClick?: () => void
  type?: 'button' | 'submit'
}

export const ModalButton: React.FC<Props> = ({ label, onClick, variant, type = 'button' }) => {

  const variantStyles = {
    cancel: 'border border-[#CBD5E1] text-[#64748B]',
    confirm: 'bg-[#378ADD] text-white',
    delete: 'bg-red-400 text-white',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex-1 ${variantStyles[variant]}`}
    >
      {label}
    </button>
  )
}