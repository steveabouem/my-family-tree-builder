# 📦 Shared Types & Utilities

This directory contains shared TypeScript types, interfaces, and utilities that are used by both the client (`temp_client`) and API (`temp_api`) applications.

## 🚀 Usage

### Importing from Client
```typescript
// Import specific types
import { FamilyMember, FamilyTree } from '@shared/types/family-tree.types';
import { User, UserSession } from '@shared/types/user.types';
import { ApiResponse, Gender } from '@shared/types/common.types';

// Import everything
import * as SharedTypes from '@shared';
```

### Importing from API
```typescript
// Import specific types
import { FamilyMember, FamilyTree } from '@shared/types/family-tree.types';
import { User, UserSession } from '@shared/types/user.types';
import { ApiResponse, Gender } from '@shared/types/common.types';

// Import everything
import * as SharedTypes from '@shared';
```

## 📁 Structure

```
shared/
├── index.ts                 # Main export file
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
├── README.md               # This file
└── types/
    ├── api.types.ts        # API response types
    ├── family-tree.types.ts # Family tree related types
    ├── user.types.ts       # User related types
    └── common.types.ts     # Common utility types
```

## 🎯 Available Types

### API Types (`api.types.ts`)
- `APIEndpointResponse` - Base API response structure
- `APIRequestPayload<T>` - Generic request payload wrapper
- `ServiceResponseWithPayload<T>` - Service layer response wrapper

### Family Tree Types (`family-tree.types.ts`)
- `FamilyMember` - Family member data structure
- `FamilyTree` - Family tree data structure
- `FamilyTreeCreateRequest` - Tree creation request
- `FamilyTreeUpdateRequest` - Tree update request
- `KinshipEnum` - Relationship types

### User Types (`user.types.ts`)
- `User` - User data structure
- `UserSession` - Session data structure
- `LoginRequest` - Login request payload
- `RegistrationRequest` - Registration request payload
- `PasswordChangeRequest` - Password change request

### Common Types (`common.types.ts`)
- `Gender` - Gender enumeration
- `MaritalStatus` - Marital status enumeration
- `ApiResponse<T>` - Generic API response
- `PaginationParams` - Pagination parameters
- `PaginatedResponse<T>` - Paginated API response
- `ValidationError` - Validation error structure
- `ValidationResult` - Validation result structure

## 🔧 Development

### Adding New Types
1. Create or update the appropriate type file in `types/`
2. Export the new types from the file
3. Add the export to `index.ts` if needed
4. Update this README with documentation

### Building
```bash
# Build the shared types
cd shared
npm run build

# Watch for changes
npm run dev
```

## 📝 Best Practices

1. **Keep types simple and focused** - Each type file should have a clear purpose
2. **Use descriptive names** - Make type names self-documenting
3. **Document complex types** - Add JSDoc comments for complex interfaces
4. **Maintain backward compatibility** - Avoid breaking changes to existing types
5. **Use enums for constants** - Use TypeScript enums for fixed value sets

## 🔗 Integration

Both `temp_client` and `temp_api` are configured to resolve `@shared/*` imports to this directory through their TypeScript configurations.

### Client Configuration
```json
{
  "paths": {
    "@shared/*": ["../shared/*"],
    "@shared": ["../shared"]
  }
}
```

### API Configuration
```json
{
  "paths": {
    "@shared/*": ["../shared/*"],
    "@shared": ["../shared"]
  }
}
``` 