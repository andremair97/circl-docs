# API Overview

## Source of Truth
The **OpenAPI 3.1 spec** in `/apis/` is the **single source of truth**.  
All code, docs, and examples must validate against it.  

- **Style**: JSON over HTTP
- **Contract**: OpenAPI 3.1 (aligned with JSON Schema 2020-12)

Core endpoints:
- `GET /search`
- `GET /products/{id}`
- `GET /scores/{id}`
- `GET /taxonomies`

