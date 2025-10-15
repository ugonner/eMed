export interface IResetPasswordDTO {
    email: string;
    password: string;
    otp: string;
}

export interface IChangePasswordDTO extends IResetPasswordDTO{
    oldPassword: string;
}