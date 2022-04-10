# tests/integration/lab-10-dynamodb.hurl

# 1. Post a new text fragment
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: application/json
{ 
  "service": "DynamoDB"
}

# We should get back a 201 response
HTTP/1.1 201

# Capture the Location URL into a variable named `url`
[Captures]
fragment1_url: header "Location"
fragment1_id : jsonpath "$.fragment.id"

# 2. GET the first fragment we just posted by its URL
GET {{fragment1_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

[Asserts]
# fragment id should be the same as the captured string
jsonpath "$.fragment.id" == {{fragment1_id}}
jsonpath "$.status" == "ok"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
# the length of our fragment data
jsonpath "$.fragment.size" == 28

# 3. Create 2nd fragment
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/markdown
```DynamoDB is **great**.```

# We should get back a 201 response
HTTP/1.1 201

# Capture the Location URL into a variable named `url`
[Captures]
fragment2_url: header "Location"
fragment2_id : jsonpath "$.fragment.id"

# 4. GET the second fragment we just posted by its URL
GET {{fragment2_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

[Asserts]
# fragment id should be the same as the captured string
jsonpath "$.fragment.id" == {{fragment2_id}}
jsonpath "$.status" == "ok"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
# the length of our fragment data
jsonpath "$.fragment.size" == 22

# 5. GET list of fragments for current user
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" isCollection
jsonpath "$.fragments[0]" == {{fragment1_id}}
jsonpath "$.fragments[1]" == {{fragment2_id}}

# 6. DELETE the first fragment using the url
DELETE {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

# 8. Try to GET the first fragment again
GET {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 404 

# 5. GET list of fragments for current user again
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" isCollection
jsonpath "$.fragments[1]" not exists
jsonpath "$.fragments[0]" == {{fragment2_id}}
