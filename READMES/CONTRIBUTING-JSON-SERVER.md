### JSON server - goodness

##### To add more endpoints to the mock API stubs for our dashboard widgets and not yet existing data

* you can just add to the endpoints in `/src/apiV2/apiV2.json`
* if you want a new endpoint called `/transactions`
* add this after the other endoints in  the mock DB stub file inside the main object

```json
"transactions": [
  {
    "name"            : "Gleb",
    "transactionCost" : 70,
    "id"              : 11,
  },
  {
    "name"            : "John",
    "transactionCost" : 50,
    "id"              : 12,
  }
]
```

#### then you will have the available resources

* `GET => /transactions`
  - returns: array of all transaciton objects in stub

* `POST => /transactions`
  - adds an object to the transactions array
  - returns: created object
  - data to POST

```json
{
  "name"            : "John",
  "transactionCost" : 50
}
```

* `GET => /transactions?name=gleb`
  - query endpoint `/transactions` for object with name gleb
  - can query for any key that is present in endpoint schema
  - returns: if query matched ? data

* `PUT => /transactions/:id`
  - updates the transactions with param `:id`
  - data to update
  - returns: updated object

```json
{
  "name"            : "Stevie Cat"
}
```

* `DELETE => /transaction/:id`
  - deletes the transaction with param `:id`
  - returns: success or failure with no data

### if you want a nested resource called `info` for the endpoint `transaction` - add another endpoint with an `ID` reference to the parent object

```json
"info": [
  {
    "name"            : "Gleb",
    "transactionCost" : 50,
    "transactionId"   : 11,
    "id"              : 10,
  },
  {
    "name"            : "John",
    "transactionCost" : 50,
    "transactionId"   : 12,
    "id"              : 12,
  }
]
```

### Now you will have an additional resource at `/transaction/:id/info`

* `GET => /transaction/:id/info`
  - this is bound to parent object by `parentId` reference in object
  - returns: relational object for current `transaction/:id`

### Use CURL from shell to test endpoints

* you can test the stub API endpoints with CURL from shell like this

```shell
#
# change port to the port that JSON-server is running on
#
# to GET
#
> curl -i -X GET http://localhost:5000/issues
#
# or GET with query
#
> curl -i -X GET http://localhost:5000/issues?name=issue+name+with+spaces
#
# or POST
#
> curl -i -X POST -H "Content-Type: application/json" -d '{"name": "cool", "catName": "Fred"}' http://localhost:5000/issues/
#
# or PUT
#
> curl -i -X PUT -H "Content-Type: application/json" -d '{"catName": "Sam"}' http://localhost:5000/issues/111
#
# or DELETE
#
> curl -i -X DELETE http://localhost:5000/issues/111
#
# win
```
