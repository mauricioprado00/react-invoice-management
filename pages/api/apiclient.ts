import { useEffect } from 'react'

const getClients = async (url: string, params: any, init: {}) => {
  console.log({clientParams: params});
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

const endpoint = (endpoint: any, userId: string, params:any): AbortableEndpointResult => {
  return abortable(authorized(endpoint.bind(null, params), userId))
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

const ignore = () => {}

const useEndpoint = (ep:any, params:any, cb:useEndpointInit, deps:any) => {
  useEffect(() => {
    const request = ep(params);
    const onReceive:useEndpointOnReceived = (fn:any) => {
      request.promise.then((response:any) => {
        if (!request.controller.signal.aborted) fn(response)
      }).catch(ignore)
    }

    return cb(onReceive, request.abort)
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
  getClients = (params:any): AbortableEndpointResult =>
    endpoint(getClients.bind(null, this.url + '/clients'), this.userId, params)
  useGetClients = useEndpoint.bind(null, this.getClients, 'hola')
}

const createApi = (url: string, userId: string) => new ApiClient(url, userId)
export default createApi
