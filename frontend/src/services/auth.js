import axios from 'axios'

const BASE = '/api/auth'

export const authApi = {
  register: async ({ name, email, password }) => {
    const res = await axios.post(`${BASE}/register`, { name, email, password })
    return res.data
  },

  login: async ({ email, password }) => {
    const res = await axios.post(`${BASE}/login`, { email, password })
    return res.data
  },

  googleLogin: async (credential) => {
    const res = await axios.post(`${BASE}/google`, { credential })
    return res.data
  },

  refresh: async (refresh_token) => {
    const res = await axios.post(`${BASE}/refresh`, { refresh_token })
    return res.data
  },

  logout: async (refresh_token) => {
    await axios.post(`${BASE}/logout`, { refresh_token })
  },

  me: async () => {
    const token = localStorage.getItem('access_token')
    const res = await axios.get(`${BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  },
}
