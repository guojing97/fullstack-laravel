export interface LoginInput {
    email: string
    password: string
}

export interface SignupRequest {
    name: string,
    email: string,
    password: string,
    re_password: string,
    occupation: string
}

export interface LoginResponse {
    user: User
    permissions: string[]
    expires_in: number
    token: string
}

export interface User {
    id: string
    email: string
    name: string
    occupation: string
}