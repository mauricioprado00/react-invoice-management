import { useEffect } from 'react'

const getClients = async (url: string, init: {}) => {
  const fetchPromise = fetch(url, init)
  const httpResponse = await fetchPromise
  const jsonResponse = await httpResponse.json()
  return jsonResponse.clients
}

const abortable = (endpointClient: any): AbortableEndpointResult => {
  const controller = new AbortController()
  const promise = endpointClient({ signal: controller.signal })

  return {
    promise,
    controller,
    abort: controller.abort.bind(controller),
  }
}

const authorized = (endpoint: any, userId: string) => (init: {}) =>
  endpoint({
    ...init,
    headers: {
      Authorization: `Bearer ${userId}`,
    },
  })

const endpoint = (endpoint: any, userId: string): AbortableEndpointResult => {
  return abortable(authorized(endpoint, userId))
}

export type AbortableEndpointResult = {
  promise: Promise<any>
  controller: AbortController
  abort: { (): void }
}
export class ApiClient {
  url: string
  userId: string
  constructor(url: string, userId: string) {
    this.url = url
    this.userId = userId
    this.getClients = this.getClients.bind(this)
  }
  getClients = (): AbortableEndpointResult =>
    endpoint(getClients.bind(null, this.url + '/clients'), this.userId)
  useGetClients = (cb:any, deps:any) => {
    useEffect(() => {
      let request = this.getClients()
      let onReceived = (clients:any) => {}
      const received = (fn:any) => {
        onReceived = fn
      }

      request.promise
        .then((clients) => {
          if (!request.controller.signal.aborted) onReceived(clients)
        })
        .catch(ignore)

      return cb(received, request.abort)
    }, deps)
  }
}

const createApi = (url: string, userId: string) => new ApiClient(url, userId)
export const ignore = () => {}
export default createApi