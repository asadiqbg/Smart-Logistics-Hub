# Mock JSON Bodies for Routes API

## 1. POST /routes/optimize

Creates optimized routes for a list of order IDs.

### Request Body

```json
{
  "orderIds": [
    "123e4567-e89b-12d3-a456-426614174000",
    "123e4567-e89b-12d3-a456-426614174001",
    "123e4567-e89b-12d3-a456-426614174002",
    "123e4567-e89b-12d3-a456-426614174003"
  ]
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/routes/optimize \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: your-tenant-id" \
  -d '{
    "orderIds": [
      "123e4567-e89b-12d3-a456-426614174000",
      "123e4567-e89b-12d3-a456-426614174001",
      "123e4567-e89b-12d3-a456-426614174002"
    ]
  }'
```

## 2. GET /routes

Retrieves all routes for the current tenant. Optional status filter.

### Without status filter

```bash
curl -X GET http://localhost:3000/routes \
  -H "X-Tenant-Id: your-tenant-id"
```

### With status filter

```bash
curl -X GET "http://localhost:3000/routes?status=planned" \
  -H "X-Tenant-Id: your-tenant-id"
```

### Query Parameters

- `status` (optional): Filter by route status
  - Possible values: `planned`, `in_progress`, `completed`, `cancelled`

## 3. GET /routes/:id

Retrieves a specific route by ID.

### cURL Example

```bash
curl -X GET http://localhost:3000/routes/123e4567-e89b-12d3-a456-426614174005 \
  -H "X-Tenant-Id: your-tenant-id"
```

---

## Testing Scenarios

### Scenario 1: Create route with multiple orders

```json
{
  "orderIds": [
    "123e4567-e89b-12d3-a456-426614174000",
    "123e4567-e89b-12d3-a456-426614174001",
    "123e4567-e89b-12d3-a456-426614174002",
    "123e4567-e89b-12d3-a456-426614174003",
    "123e4567-e89b-12d3-a456-426614174004"
  ]
}
```

### Scenario 2: Create route with single order

```json
{
  "orderIds": ["123e4567-e89b-12d3-a456-426614174000"]
}
```

### Scenario 3: Get only planned routes

```bash
curl -X GET "http://localhost:3000/routes?status=planned" \
  -H "X-Tenant-Id: your-tenant-id"
```

### Scenario 4: Get only in-progress routes

```bash
curl -X GET "http://localhost:3000/routes?status=in_progress" \
  -H "X-Tenant-Id: your-tenant-id"
```

---

## Notes

1. **Tenant ID**: Replace `your-tenant-id` with your actual tenant ID in the `X-Tenant-Id` header
2. **Order IDs**: Ensure the order IDs you provide exist in your database and belong to the same tenant
3. **UUID Format**: All IDs must be valid UUID v4 strings
4. **Route Status Values**:
   - `planned` - Route is optimized but not started
   - `in_progress` - Driver has started the route
   - `completed` - Route is fully completed
   - `cancelled` - Route was cancelled

---

## HTTPie Examples (Alternative to cURL)

```bash
# Create optimized routes
http POST localhost:3000/routes/optimize \
  X-Tenant-Id:your-tenant-id \
  orderIds:='["123e4567-e89b-12d3-a456-426614174000","123e4567-e89b-12d3-a456-426614174001"]'

# Get all routes
http GET localhost:3000/routes \
  X-Tenant-Id:your-tenant-id

# Get filtered routes
http GET localhost:3000/routes\?status==planned \
  X-Tenant-Id:your-tenant-id

# Get specific route
http GET localhost:3000/routes/123e4567-e89b-12d3-a456-426614174005 \
  X-Tenant-Id:your-tenant-id
```
