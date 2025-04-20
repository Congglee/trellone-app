import { jwtDecode } from 'jwt-decode'
import { TokenPayload } from '~/types/jwt.type'

export const decodeToken = <T extends TokenPayload = TokenPayload>(token: string) => {
  return jwtDecode<T>(token) as T
}
