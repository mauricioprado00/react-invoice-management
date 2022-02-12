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

type useEndpointOnReceivedCb = {
  (received:any): void
}
type useEndpointOnReceived = {
  (cb:useEndpointOnReceivedCb): void
}
type useEndpointInit = {
  (received:useEndpointOnReceived, abort:{(): void}): void
}

const useEndpoint = (ep:any, cb:useEndpointInit, deps:any) => {
  const requester = ep.bind(this)
  useEffect(() => {
    const request = requester();
    let onReceived = (response:any) => {}
    const received = (fn:any) => {
      onReceived = fn
    }

    request.promise
      .then((response:any) => {
        if (!request.controller.signal.aborted) onReceived(response)
      })
      .catch(ignore)

    return cb(received, request.abort)
  }, deps)
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
  useGetClients = useEndpoint.bind(this, this.getClients)
}

const createApi = (url: string, userId: string) => new ApiClient(url, userId)
export const ignore = () => {}
export default createApi
