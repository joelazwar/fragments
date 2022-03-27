# tests/integration/post-fragments-unauthenticated.hurl
# Unauthenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We should get back a 201 response
HTTP/1.1 401

# Extra checks to perform against the response
[Asserts]

jsonpath "$.status" == "error"

jsonpath "$.error.code" == 401

jsonpath "$.error.message" == "Unauthorized"
