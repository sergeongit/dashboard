const DEFAULT_BACKEND_URL = import.meta.env.DEV ? 'http://localhost:4000' : ''

export const API_URL = import.meta.env.VITE_API_URL || DEFAULT_BACKEND_URL
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL
