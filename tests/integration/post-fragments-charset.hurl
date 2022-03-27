# tests/integration/post-fragments-charset.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a plain text fragment with a charset of utf-8
Content-Type: text/markdown; charset=utf-8
# Body of the request goes in ```...``` when it's a string
```
# This is a list

- 1
- 2
- 3
```

# We should get back a 201 response
HTTP/1.1 201

# Extra checks to perform against the response
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
# Expect back the mime type with charset=utf-8 indicator
jsonpath "$.fragment.type" == "text/markdown; charset=utf-8"

jsonpath "$.fragment.size" == 30

[Captures]
url: header "Location"

# GET the fragment we just posted by its URL
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: text/markdown; charset=utf-8
Content-Length: 30
[Asserts]
body == "# This is a list\n\n- 1\n- 2\n- 3\n"

