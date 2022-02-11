
const getClients = async (url:string) => {
    const fetchPromise = fetch(url, {
      headers: {
        Authorization: 'Bearer 111',
      },
    })
    const httpResponse = await fetchPromise
    const jsonResponse = await httpResponse.json()
    return jsonResponse.clients
}

export class ApiClient {
  url: string
  constructor(url: string) {
    this.url = url
    this.getClients = this.getClients.bind(this)
  }
  getClients = () => getClients(this.url + '/clients')
}

const createApi = (url: string) => new ApiClient(url)
export default createApi
