# setup

```
# install npm dependencies for frontend
npm install 

# get the API server
git clone git@github.com:mauricioprado00/invoice-rest-api.git ../invoice-rest-api

# install npm deps for api
pushd ../invoice-rest-api

npm install 
npm run build

# copy env file
cp .env.example .env

popd
```

# Starting frontend and backend

```bash
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
