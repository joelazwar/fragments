# 404 Response Test
GET http://localhost:8080/no-such-route

# We should get back an HTTP 1.1 200 response
HTTP/1.1 404

# Extra checks to perform against the response
[Asserts]
# We expect to get back a JSON response with { "status": "ok", ... }
jsonpath "$.status" == "error"
# We expect to get back a JSON response with { ..., "error": {...} }
jsonpath "$.error" isCollection
# We expect to get back a JSON response with { ..., : {"code": "..." }}
jsonpath "$.error.code" == 404
# We expect to get back a JSON response with { ..., : {"message": "..." }}
jsonpath "$.error.message" == "not found"
