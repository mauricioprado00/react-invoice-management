import { Client, ClientWithTotals, ClientWithTotalsList } from 'models/Client'
import { ClientInvoice, ClientInvoiceList, Invoice } from 'models/Invoice'
import { LoginResponse, RegisterData, LoginCredentials, UserWithPassword, Me } from 'models/User'
import { MapType } from 'models/UtilityModels'
interface ApiInitParams extends RequestInit {
  signal: AbortSignal,
}

const upsertClient = (url: string) => (client:Client) => async (init: ApiInitParams) => {
  const fetchPromise = fetch(url, {
    ...init,
    method: client.id ? 'PUT' : 'POST',
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

const upsertInvoice = (url: string) => (clientInvoice:ClientInvoice) => async (init: ApiInitParams) => {
  const fetchPromise = fetch(url, {
    ...init,
    method: clientInvoice.invoice.id ? 'PUT' : 'POST',
    headers: {
      ...init.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clientInvoice.invoice)
  })
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }
  return {...clientInvoice, invoice: jsonResponse.invoice}
}

const registerUser = (url: string) => (user:UserWithPassword) => async (init: ApiInitParams) => {
  const fetchPromise = fetch(url, {
    ...init,
    method: 'POST',
    headers: {
      ...init.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }
  return jsonResponse
}

const loginUser = (url: string) => (loginCredentials:LoginCredentials) => async (init: ApiInitParams) => {
  const fetchPromise = fetch(url, {
    ...init,
    method: 'POST',
    headers: {
      ...init.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginCredentials)
  })
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }
  return jsonResponse as LoginResponse
}

const getMe = (url: string) => (arg:void) => async (init: ApiInitParams) => {
  const fetchPromise = fetch(url, {
    ...init,
    method: 'GET',
    headers: {
      ...init.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }
  return jsonResponse as Me
}

const updateMe = (url: string) => (me:Me) => async (init: ApiInitParams) => {
  const fetchPromise = fetch(url, {
    ...init,
    method: 'PUT',
    headers: {
      ...init.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(me.companyDetails)
  })
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }

  // only this EP has success property
  if (jsonResponse.success !== true) {
    throw new Error("Operation error")
  }
  return jsonResponse.user as Me
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

const getClient = (url: string) => ({clientId}:{clientId:string}) => async (init: ApiInitParams) => {
  const fetchPromise = fetch(url + '/' + clientId, init);
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }
  if(!jsonResponse.success) {
    throw new Error("Client data retrieval failed");
  }
  return jsonResponse.client
}

const getClientWithTotals = (url: string) => ({clientId}:{clientId:string}) => async (init: ApiInitParams) => {
  const params = new URLSearchParams({filter: JSON.stringify({clientId})});
  const fetchPromise = fetch(url + '?' + params, init);
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }
  if(jsonResponse.total !== 1) {
    throw new Error("Client data retrieval failed");
  }
  return jsonResponse.clients[0]
}

export type InvoiceListingSortingByArgs = {
  date?: "asc" | "desc"
  price?: "asc" | "desc"
  companyName?: "asc" | "desc"
  dueDate?: "asc" | "desc"
}

export type InvoiceListingFilterByArgs = {
  clientId?: string
  date?: {
      start?: number
      end?: number
  }

  dueDate?: {
      start?: number
      end?: number
  }
}

export type InvoiceListingArgs = {
  filter?: InvoiceListingFilterByArgs,
  sort?: InvoiceListingSortingByArgs,
  offset?: number,
  limit?: number,
}

export type InvoiceListingArgsU = InvoiceListingArgs | undefined

export type ClientInvoiceListResponse = {
  invoices: ClientInvoiceList,
  total: number,
}

const getInvoices = (url: string) => (args:InvoiceListingArgsU) => async (init: ApiInitParams) => {
  const params = new URLSearchParams();
  if (args) {
    params.set('params',JSON.stringify(args));
  }
  const fetchPromise = fetch(url + '?' + params, init);
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }
  return jsonResponse
}

const getInvoice = (url: string) => ({id}:{id:string}) => async (init: ApiInitParams) => {
  const fetchPromise = fetch(url + '/' + id, init);
  const httpResponse = await fetchPromise
  if (httpResponse.ok !== true) {
    throw await httpResponse.text();
  }
  const jsonResponse = await httpResponse.json()
  if(init.signal.aborted) {
    throw new Error("Aborted operation")
  }
  if(!jsonResponse.success) {
    throw new Error("Invoice data retrieval failed");
  }
  return jsonResponse.invoice
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

const thenNo = () => {};
const createClient = (url:string, bearerToken:string) => ({
  abortAll,
  newBearerToken: function (bearerToken:string) {Object.assign(this, createClient(url, bearerToken))},
  getClients: (then:Then<ClientWithTotalsList>): AbortableEndpointResult<ClientWithTotalsList> =>
    endpoint<ClientWithTotalsList>(getClients(url + '/clients'), bearerToken, then, {}),
  getClientWithTotals: (clientId:string, then:Then<ClientWithTotals>=thenNo): AbortableEndpointResult<ClientWithTotals> =>
    endpoint<ClientWithTotals>(getClientWithTotals(url + '/clients'), bearerToken, then, {clientId}),
  getClient: (clientId:string, then:Then<Client>=thenNo): AbortableEndpointResult<Client> =>
    endpoint<Client>(getClient(url + '/clients'), bearerToken, then, {clientId}),
  getInvoices: (params:InvoiceListingArgsU, then:Then<ClientInvoiceListResponse>): AbortableEndpointResult<ClientInvoiceListResponse> =>
    endpoint<ClientInvoiceListResponse>(getInvoices(url + '/invoices'), bearerToken, then, params || {}),
  getInvoice: (id:string, then:Then<Invoice>=thenNo): AbortableEndpointResult<Invoice> =>
    endpoint<Invoice>(getInvoice(url + '/invoices'), bearerToken, then, {id}),
  upsertClient: (client:Client, then:Then<Client>): AbortableEndpointResult<Client> =>
    endpoint<Client>(upsertClient(url + '/clients'), bearerToken, then, client),
  registerUser: (user:UserWithPassword, then:Then<RegisterData>): AbortableEndpointResult<RegisterData> =>
    endpoint<RegisterData>(registerUser(url + '/register'), bearerToken, then, user),
  loginUser: (loginCredentials:LoginCredentials, then:Then<LoginResponse>): AbortableEndpointResult<LoginResponse> =>
    endpoint<LoginResponse>(loginUser(url + '/login'), bearerToken, then, loginCredentials),
  getMe: (then:Then<Me>): AbortableEndpointResult<Me> =>
    endpoint<Me>(getMe(url + '/me'), bearerToken, then, {}),
  updateMe: (me:Me, then:Then<Me>): AbortableEndpointResult<Me> =>
    endpoint<Me>(updateMe(url + '/me/company'), bearerToken, then, me),
  upsertInvoice: (clientInvoice:ClientInvoice, then:Then<ClientInvoice>): AbortableEndpointResult<ClientInvoice> =>
    endpoint<ClientInvoice>(upsertInvoice(url + '/invoices'), bearerToken, then, clientInvoice),
})


export default createClient;