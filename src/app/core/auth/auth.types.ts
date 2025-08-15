export interface SignInRequest {
    email: string;
    password: string;
}

export interface SetPasswordRequest {
    code?: string;
    confirmPassword: string;
    password: string;
}

export interface ChangePassword {
    confirmPassword: string;
    newPassword: string;
    oldPassword?: string;
}

export interface ResetPasswordRequest {
    code?: string;
    confirmPassword: string;
    password: string;
}

export interface TokenResponse {
    refreshToken?: string;
    accessToken?: string;
}
