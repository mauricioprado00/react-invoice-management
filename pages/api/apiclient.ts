import { ClientList } from '../../models/Client'
import { InvoiceList } from '../../models/Invoice'

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

const abortable = (endpointClient: any): AbortableEndpointResult<any> => {
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

const endpoint = <Type>(endpoint: any, userId: string, then:Then<Type>): AbortableEndpointResult<Type> => {
  const result = abortable(authorized(endpoint, userId))
  result.promise.then<Type>(then).catch(ignore)
  return result;
}

type Cb = {(...many:any[]):any}
type Then<Type> = {(result:Type):any}

export type AbortableEndpointResult<Type> = {
  promise: Promise<Type>
  controller: AbortController
  abort: { (): void }
}

const abortAll = (...results:AbortableEndpointResult<any>[]):Cb => () => {
  results.forEach(result => result.abort());
}

const createClient = (url:string, bearerToken:string) => ({
  abortAll,
  getClients: (then:Then<ClientList>): AbortableEndpointResult<ClientList> =>
    endpoint<ClientList>(getClients(url + '/clients'), bearerToken, then),
  getInvoices: (then:Then<InvoiceList>): AbortableEndpointResult<InvoiceList> =>
    endpoint<InvoiceList>(getInvoices(url + '/invoices'), bearerToken, then),
})


export default createClient;