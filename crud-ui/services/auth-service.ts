import api from "@/lib/axios"
import { decryptObject, decryptToken, encryptObject, encryptToken } from "@/lib/crypto"
import { LoginInput, SignupRequest } from "@/models/auth_model"


export async function SigninService(input: LoginInput) {
    const response = await api.post('/auth/signin', input)

    const encryptedToken = encryptToken(response.data.token)
    localStorage.setItem('auth_token', encryptedToken)

    // Simpan object user tanpa token
    const user = response.data
    localStorage.setItem('auth_user', encryptObject(user))
}

export async function SignupService(input: SignupRequest) {
    const response = await api.post('/auth/signup', input)
    const encryptedToken = encryptToken(response.data.token)
    localStorage.setItem('auth_token', encryptedToken)

    // Simpan object user tanpa token
    const user = response.data
    localStorage.setItem('auth_user', encryptObject(user))
}

export function GetUser() {
    const encrypted = localStorage.getItem('auth_user')
    if (!encrypted) return null
    return decryptObject(encrypted)
}

export async function GetToken() {
    const encrypted = await localStorage.getItem('auth_token')
    return encrypted ? decryptToken(encrypted) : null
}

export function Logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
}