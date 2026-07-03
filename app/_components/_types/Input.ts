
export type SignUpInput = {
  name: string
  email: string
  password: string
}

export type SignInInput = {
  email: string
  password: string
}

export type ForgetPassword = {
  email: string
}

export type ResetPassword = {
  password: string
  confirmPassword: string
}