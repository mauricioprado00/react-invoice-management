const getClients = async (url: string, init: {}) => {
  const fetchPromise = fetch(url, init)
  const httpResponse = await fetchPromise
  const jsonResponse = await httpResponse.json()
  return jsonResponse.clients
}

const abortable = (endpointClient: any): AbortableEndpointResult => {
  const controller = new AbortController()
  const promise = endpointClient({ signal: controller.signal })

  const result = {
    promise,
    abort: () => {
      controller.abort()
      result.aborted = true
    },
    aborted: false,
  }
  return result
}

const authorized = (endpoint: any) => (init: {}) =>
  endpoint({
    ...init,
    headers: {
      Authorization: 'Bearer 111',
    },
  })

const endpoint = (endpoint: any): AbortableEndpointResult => {
  return abortable(authorized(endpoint))
}

export type AbortableEndpointResult = {
  promise: Promise<any>
  aborted: boolean
  abort: { (): void }
}
export class ApiClient {
  url: string
  constructor(url: string) {
    this.url = url
    this.getClients = this.getClients.bind(this)
  }
  getClients = (): AbortableEndpointResult =>
    endpoint(getClients.bind(null, this.url + '/clients'))
}

const createApi = (url: string) => new ApiClient(url)
export default createApi
