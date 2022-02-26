import { Client, ClientWithTotalsList } from 'models/Client'
import { ClientInvoice, ClientInvoiceList } from 'models/Invoice'
import { MapType } from 'models/UtilityModels'
interface ApiInitParams extends RequestInit {
  signal: AbortSignal,
}

const addClient = (url: string) => (client:Client) => async (init: ApiInitParams) => {
  const fetchPromise = fetch(url, {
    ...init,
    method: 'POST',
    headers: {
      ...init.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(client)
  })
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }
  return jsonResponse.client
}

const getClients = (url: string) => (arg:void) => async (init: ApiInitParams) => {
  const fetchPromise = fetch(url, init)
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }
  return jsonResponse.clients
}

const getInvoices = (url: string) => (arg:void) => async (init: ApiInitParams) => {
  const fetchPromise = fetch(url, init)
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }
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

const endpoint = <Type>(endpoint: any, userId: string, then:Then<Type>, epExtra:MapType<any>): AbortableEndpointResult<Type> => {
  const result = abortable(authorized(endpoint(epExtra), userId))
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

export type AbortableObject = {
  abort: { (): void }
}

const abortAll = (...results:AbortableObject[]):Cb => () => {
  results.forEach(result => result.abort());
}

const createClient = (url:string, bearerToken:string) => ({
  abortAll,
  newBearerToken: function (bearerToken:string) {Object.assign(this, createClient(url, bearerToken))},
  getClients: (then:Then<ClientWithTotalsList>): AbortableEndpointResult<ClientWithTotalsList> =>
    endpoint<ClientWithTotalsList>(getClients(url + '/clients'), bearerToken, then, {}),
  getInvoices: (then:Then<ClientInvoiceList>): AbortableEndpointResult<ClientInvoiceList> =>
    endpoint<ClientInvoiceList>(getInvoices(url + '/invoices'), bearerToken, then, {}),
  addClient: (client:Client, then:Then<Client>): AbortableEndpointResult<Client> =>
    endpoint<Client>(addClient(url + '/clients'), bearerToken, then, client),
})


export default createClient;