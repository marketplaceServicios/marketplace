const BASE_URL = 'http://localhost:4000/api'

const getToken = () => localStorage.getItem('admin_token')

const request = async (method, path, body) => {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud')
  return data
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),

  uploadImage: async (file) => {
    const token = getToken()
    const form = new FormData()
    form.append('imagen', file)
    const res = await fetch(`${BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Error al subir imagen')
    return data.url
  }
}
