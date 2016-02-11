## ROADMAP

### API v1

* Great job so far on the API everyone!

### **FIRST UP**

* Right now we are sending SnakeCase key names to the API and we are receiving camelCase key names in some responses and SnakeCase keys in others.
* Can we please standardize these. We should send and receive either SnakeCase or camelCase NOT both.

#### ENDPOINT   ->    `/merchant/me`

* We will use this to return the merchant account info

| Endpoint    | Data          | Verb | Returns                                          |
| ---------   | :-----------  | :--- | :----------------------------------------------  |
| merchant/me | MerchantToken | POST | MerchantId, FirstName, LastName, MobileNo, email |


### Universal Status Codes **For All Methods**

| Status Code  | Status Message                                               | Reason                                                                   |
| ------------ | :----------------------------------------------------------: | :-------------------------------------------------------------------     |
| 0            | (object.name) (method) successful                            | method successful                                                        |
| 1            | key(Fingerprint, Offer, Campaign) name formatted incorrectly | method update fails because name has incorrect format                    |
| 2            | key(Fingerprint, Offer, Campaign) already exists             | method update fails because name is not unique                           |
| 3            | Invalid merchant token                                       | method update fails because merchant session expired and token not valid |



### Current Endpoints For Fingerprint

| Endpoint                     | Data                                                                             | Verb       | Returns                                              |
| ---------------------------- | :------------------------------------------------------------------------------- | :--------: | :--------------------------------------------------- |
| merchant/fingerprint/new     | MerchantToken, FingerprintName, Gender, MinIncome, MaxIncome, MinAge, MaxAge     | POST       | FingerprintId (please return created object)         |
| merchant/fingerprint/update  | MerchantToken, FingerprintName, Gender, MinIncome, MaxIncome, MinAge, MaxAge     | POST       | FingerprintId (please return updated object)         |
| merchant/fingerprint/delete  | MerchantToken, FingerprintId                                                     | POST       | FingerprintId (please return deleted object)         |
| merchant/fingerprint/get     | MerchantToken, FingerprintId                                                     | POST       | Fingerprint(object)                                  |
| merchant/fingerprint/all     | MerchantToken                                                                    | POST       | All Fingerprints for merchant                        |



## API v2 (to come when time is ripe)

#### We also need status codes per fingerprint offer and campaign

* to feed the user useful updates
* to make bulletproof transactions

----

##### This is what we have now

###### To get one Fingerprint

* we make a **POST** call to `/merchant/fingerprint/get`
* with data :

```js
{
  MerchantToken: 1420728185275,
  FingerprintId: 1
}
```

### This is what I would really like to have (we need)

* we make a **GET** call to `/merchant/fingerprint/:fingerprintId`
* where `fingerprintId` is the ID of the fingeprint we want to get
* with data

```js
{
  MerchantToken: 1420728185275
}
```

###### To get all Fingerprints


* we make a **POST** call to `/merchant/fingerprint/all`
* with data :

```js
{
  MerchantToken: 1420728185275
}
```

### This is what I would really like to have (we need)

* we make a **GET** call to `/merchant/fingerprint`
* it automatically is the `all` endpoint
* with data

```js
{
  MerchantToken: 1420728185275
}
```

###### To delete a Fingerprint


* we make a **POST** call to `/merchant/fingerprint/delete`
* with data :

```js
{
  MerchantToken: 1420728185275,
  FingerprintId: 1
}
```

* server deletes the fingerprint and then returns just the fingerprintId


```js
{
  "FlikResponse":
  {
    "Status":
    {
      "StatusCode":"0",
      "StatusMessage":"Method call successful"
    },
    "Data":{
      "MerchantFingerPrintDelete":{
        "FingerprintId":4
      }
    }
  }
}
```


### This is what I would really like to have (we need)

* we make a **DELETE** call to `/merchant/fingerprint/:fingerprintId`
* with data

```js
{
  MerchantToken: 1420728185275
}
```

* server deletes the fingerprint and then returns the object that it deleted

```js
{
  "FlikResponse":
  {
    "Status":
    {
      "StatusCode":"0",
      "StatusMessage":"Fingerprint deleted successfully"
    },
    "Data":{
      "MerchantFingerPrintDelete":{
        {
          "fingerprintId":57,
          "fingerprintName":"cool",
          "gender":"Male",
          "minAge":21,
          "maxAge":77,
          "income":999999,
          "merchantId":3,
          "dateCreated":"2015-01-07 06:56:30.0",
          "dateDeleted":"2015-01-21 06:56:30.0"
        },
      }
    }
  }
}
```

###### To update a Fingerprint

* we make a **POST** call to `/merchant/fingerprint/update`
* with data :

```js
{
  MerchantToken: 1420728185275,
  FingerprintId: 1,
  FingeprintName: 'Cool',
  Gender: 'Male',
  MinAge: 21,
  MaxAge: 29,
  Income: 210000
}

// VERY IMPORTANT  ->  we need a MinIncome and MaxIncome
```

* server updates the fingerprint and then returns just the fingerprintId

```js
{
  "FlikResponse":
  {
    "Status":
    {
      "StatusCode":"0",
      "StatusMessage":"Method call successful"
    },
    "Data":{
      "FingerPrintUpdate":{
        "FingerprintId":21
      }
    }
  }
}
```


### This is what I would really like to have (we need)

* we make a **PUT** or **PATCH** call to `/merchant/fingerprint/:fingerprintId`
* if **PUT** with data

```js
{
  "fingerprintName":"cool",
  "gender":"Male",
  "minAge":21,
  "maxAge":77,
  "income":999999
}
```
* if **PATCH** with data

```js
{
    "op": "replace",
    "path": "/email",
    "value": "new.email@example.org"
}
```

* server updates the fingerprint and then returns the object that it updated

```js
{
  "FlikResponse":
  {
    "Status":
    {
      "StatusCode":"0",
      "StatusMessage":"Fingerprint updated successfully"
    },
    "Data":{
      "FingerPrintUpdate":{
        {
          "fingerprintId":57,
          "fingerprintName":"cool",
          "gender":"Male",
          "minAge":21,
          "maxAge":77,
          "income":999999,
          "merchantId":3,
          "dateCreated":"2015-01-07 06:56:30.0",
          "dateDeleted":"2015-01-21 06:56:30.0"
        },
      }
    }
  }
}
```

###### To query Fingerprints

### This is what I would really like to have (we need)

* we make a **GET** call to `/merchant/fingerprint:?query`
* where `:?query` is the params we want to query fingerprints for
* with data

```js
{
  MaxAge: 77,
  Income: 999999
}
```

*or

```js
{
  Gender: "Male"
}
```
* etc.


* server returns the fingerprint or fingerprints based on the query

```js
{
  "FlikResponse":
  {
    "Status":
    {
      "StatusCode":"0",
      "StatusMessage":"Method call Successful"
    },
    "Data":{
      "FingerprintQuery":{
        {
            "fingerprintId":2,
            "fingerprintName":"Test test",
            "gender":"Male",
            "minAge":12,
            "maxAge":45,
            "income":1234,
            "merchantId":7,
            "dateCreated":"2015-01-05 13:33:13.0"
        },
        {
            "fingerprintId":4,
            "fingerprintName":"hsjhsdjk",
            "gender":"male",
            "minAge":25,
            "maxAge":60,
            "income":210000000,
            "merchantId":7,
            "dateCreated":"2015-01-05 13:47:13.0"
        },
        {
            "fingerprintId":5,
            "fingerprintName":"mydsjhdkh",
            "gender":"male",
            "minAge":30,
            "maxAge":64,
            "income":210000000,
            "merchantId":1,
            "dateCreated":"2015-01-05 14:06:17.0"
        },
      }
    }
  }
}
```

### these same concepts need to be applied to Campaign and Offer please.


# NOTES

* we need to use **GET** instead of **POST** to retrieve and query records because it is more reusable
* we need to use **PATCH** (ideally) or or **PUT** to update records
  * this is how that works:
  * **PATCH**    ->     `/merchant/fingerprint/:fingerprintId`
  * where `:fingerprintId` is the id of the fingerprint we are trying to update.
  * with data    ->     `{ "op": "replace", "path": "/email", "value": "new.email@example.org" }`
  * The difference between the PUT and PATCH requests is reflected in the way the server processes the enclosed entity to modify the resource identified by the Request-URI. In a PUT request, the enclosed entity is considered to be a modified version of the resource stored on the origin server, and the client is requesting that the stored version be replaced. With PATCH, however, the enclosed entity contains a set of instructions describing how a resource currently residing on the origin server should be modified to produce a new version. The PATCH method affects the resource identified by the Request-URI, and it also MAY have side effects on other resources; i.e., new resources may be created, or existing ones modified, by the application of a PATCH.
* I would like to use the REST standard verbs so we don't have to live in CRAZYTOWN
