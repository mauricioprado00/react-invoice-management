import { useEffect } from 'react'

const getClients = (url: string) => async (init: {}) => {
  const fetchPromise = fetch(url, init)
  const httpResponse = await fetchPromise
  const jsonResponse = await httpResponse.json()
  return jsonResponse.clients
}

const getInvoices = (url: string) => async (init: {}) => {
  const fetchPromise = fetch(url, init)
  const httpResponse = await fetchPromise
  const jsonResponse = await httpResponse.json()
  return jsonResponse.invoices
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

const ignore = () => {}

const endpoint = (endpoint: any, userId: string, then:Then): AbortableEndpointResult => {
  const result = abortable(authorized(endpoint, userId))
  result.promise.then(then).catch(ignore)
  return result;
}

type Cb = {(...many:any[]):any}
type Then = Cb

export type AbortableEndpointResult = {
  promise: Promise<any>
  controller: AbortController
  abort: { (): void }
}

const abortAll = (...results:AbortableEndpointResult[]) => () => {
  results.forEach(result => result.abort());
}

const createClient = (url:string, bearerToken:string) => ({
  abortAll,
  getClients: (then:Then): AbortableEndpointResult =>
    endpoint(getClients(url + '/clients'), bearerToken, then),
  getInvoices: (then:Then): AbortableEndpointResult =>
    endpoint(getInvoices(url + '/invoices'), bearerToken, then),
})


export default createClient;