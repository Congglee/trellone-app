import axios, { AxiosInstance } from 'axios'
import { envConfig } from '~/constants/config'

export class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: envConfig.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

const http = new Http().instance

export default http
