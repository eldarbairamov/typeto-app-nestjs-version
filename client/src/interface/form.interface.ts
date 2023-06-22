export interface ILoginForm {
   email: string;
   password: string;
}

export interface IRegistrationForm {
   email: string;
   username: string;
   password: string;
}

export interface IResetPasswordForm {
   newPassword: string;
   repeatPassword: string;
}
