
# Use sample data
1. copy content of `invoices.json` and `clients.json` to `fake-database` on api server
# Generate new data
## Generate clients
1. copy the content of `json-generator-client.js` to https://json-generator.com/
1. copy generated data to `fake-database/clients.json`


## Generate Invoices
1. copy the content of `json-generator-invoice.js` to https://json-generator.com/
1. paste the content in https://json-generator.com/
1. paste the generated result in `fake-database/invoices.json`


## Restart the server
```bash
docker-compose restart backend
```

