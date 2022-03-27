# tests/integration/post-fragments-unauthenticated.hurl
# Unauthenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# Set an unsupported type to the header
Content-Type: text/csv
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We should get back a 201 response
HTTP/1.1 415

# Extra checks to perform against the response
[Asserts]

jsonpath "$.status" == "error"

jsonpath "$.error.code" == 415

jsonpath "$.error.message" == "Invalid type: Not Supported"
