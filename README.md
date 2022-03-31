# run the app

```
# get the API server
git clone git@github.com:vladnicula/invoice-rest-api.git ../invoice-rest-api

# start backend and frontend
docker-compose up -d
```
# unit test 
```
npm run jest
```

# run integration test
```
npm run cypress
```

# test user
the following user has sample filled sample data:
```json
    {
        "id": "111",
        "name": "John Doe 1",
        "email": "fake_user1@officehourtesting.com",
        "password": "123456",
    }
```