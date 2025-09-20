# Services V2 - React Query Implementation

This directory contains the v2 version of all services using React Query for better state management, caching, and error handling.

## Available Services

### Auth V2 (`authV2.ts`)
Authentication services with React Query hooks.

## Available Hooks

### `useLogin()`
Replaces `submitLoginForm` from the original auth.ts

```typescript
import { useLogin } from '../services/v2/authV2';

const LoginComponent = () => {
  const loginMutation = useLogin();

  const handleLogin = (values: Partial<UserDTO>) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        console.log('Login successful:', data);
        // Navigate to dashboard or handle success
      },
      onError: (error) => {
        console.error('Login failed:', error);
        // Handle error (show toast, etc.)
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### `useRegister()`
Replaces `submitRegistrationForm` from the original auth.ts

```typescript
import { useRegister } from '../services/v2/authV2';

const RegisterComponent = () => {
  const registerMutation = useRegister();

  const handleRegister = (values: Partial<UserDTO>) => {
    registerMutation.mutate(values, {
      onSuccess: (data) => {
        console.log('Registration successful:', data);
        // Navigate to login or handle success
      },
      onError: (error) => {
        console.error('Registration failed:', error);
        // Handle error
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};
```

### `useChangePassword()`
Replaces `submitPasswordChangeForm` from the original auth.ts

```typescript
import { useChangePassword } from '../services/v2/authV2';

const ChangePasswordComponent = () => {
  const changePasswordMutation = useChangePassword();

  const handlePasswordChange = (values: ChangePasswordValues) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        console.log('Password changed successfully');
        // Show success message
      },
      onError: (error) => {
        console.error('Password change failed:', error);
        // Handle error
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handlePasswordChange)}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={changePasswordMutation.isPending}
      >
        {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
      </button>
    </form>
  );
};
```

### `useLogout()`
Replaces `logout` from the original auth.ts

```typescript
import { useLogout } from '../services/v2/authV2';

const LogoutComponent = () => {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        console.log('Logged out successfully');
        // Navigate to login page
      },
      onError: (error) => {
        console.error('Logout failed:', error);
        // Still navigate to login page even if API fails
      }
    });
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
};
```

## Benefits of React Query Implementation

1. **Automatic Caching**: User data is cached and shared across components
2. **Loading States**: Built-in `isPending` state for better UX
3. **Error Handling**: Centralized error handling with `onError` callbacks
4. **Cache Invalidation**: Automatic cache management on login/logout
5. **Optimistic Updates**: Can implement optimistic updates for better UX
6. **Retry Logic**: Built-in retry mechanisms for failed requests
7. **Background Refetching**: Automatic background updates

## Migration Guide

To migrate from the original auth.ts functions:

1. Replace direct function calls with React Query hooks
2. Use the `mutate` method instead of calling functions directly
3. Handle loading states with `isPending`
4. Use `onSuccess` and `onError` callbacks for side effects
5. Remove manual error handling as it's handled by React Query

## API Functions

The underlying API functions are also exported for direct use if needed:

```typescript
import { loginAPI, registerAPI, changePasswordAPI, logoutAPI } from '../services/v2/authV2';
```

---

### Family Tree V2 (`familyTreeV2.ts`)
Family tree management services with React Query hooks.

#### Available Hooks

##### `useGetAllForUser(userId, enabled?)`
Gets all family trees for a specific user.

```typescript
import { useGetAllForUser } from '../services/v2/familyTreeV2';

const FamilyTreesComponent = ({ userId }: { userId: number }) => {
  const { data: trees, isLoading, error } = useGetAllForUser(userId);

  if (isLoading) return <div>Loading trees...</div>;
  if (error) return <div>Error loading trees</div>;

  return (
    <div>
      {trees?.map(tree => (
        <div key={tree.id}>{tree.name}</div>
      ))}
    </div>
  );
};
```

##### `useGetTreeById(treeId, enabled?)`
Gets a specific family tree by ID.

```typescript
import { useGetTreeById } from '../services/v2/familyTreeV2';

const TreeDetailsComponent = ({ treeId }: { treeId: string }) => {
  const { data: tree, isLoading, error } = useGetTreeById(treeId);

  if (isLoading) return <div>Loading tree...</div>;
  if (error) return <div>Error loading tree</div>;

  return <div>{tree?.name}</div>;
};
```

##### `useCreateFamilyTree()`
Creates a new family tree.

```typescript
import { useCreateFamilyTree } from '../services/v2/familyTreeV2';

const CreateTreeComponent = () => {
  const createTreeMutation = useCreateFamilyTree();

  const handleCreateTree = (treeData: FamilyTree) => {
    createTreeMutation.mutate(treeData, {
      onSuccess: (data) => {
        console.log('Tree created successfully:', data);
        // Navigate to the new tree
      },
      onError: (error) => {
        console.error('Failed to create tree:', error);
      }
    });
  };

  return (
    <button 
      onClick={() => handleCreateTree(treeData)}
      disabled={createTreeMutation.isPending}
    >
      {createTreeMutation.isPending ? 'Creating...' : 'Create Tree'}
    </button>
  );
};
```

##### `useGetMembers(treeId, enabled?)`
Gets members of a specific family tree.

##### `useAddMembers()`
Adds members to a family tree.

##### `useGetGenealogyFormFieldsForStep(step, enabled?)`
Gets form fields for genealogy step forms.

---

### User V2 (`userV2.ts`)
User-related services with React Query hooks.

#### Available Hooks

##### `useGetRelatedFamilies(id, enabled?)`
Gets families related to a user.

```typescript
import { useGetRelatedFamilies } from '../services/v2/userV2';

const RelatedFamiliesComponent = ({ userId }: { userId: string }) => {
  const { data: families, isLoading, error } = useGetRelatedFamilies(userId);

  if (isLoading) return <div>Loading families...</div>;
  if (error) return <div>Error loading families</div>;

  return (
    <div>
      {families?.map(family => (
        <div key={family.id}>{family.name}</div>
      ))}
    </div>
  );
};
```

##### `useGetExtendedFamilies(id, enabled?)`
Gets extended families for a user.

---

### Session V2 (`sessionV2.ts`)
Session management services with React Query hooks.

#### Available Hooks

##### `useGetCurrentSession(id, enabled?)`
Gets the current session for a user.

```typescript
import { useGetCurrentSession } from '../services/v2/sessionV2';

const SessionComponent = ({ userId }: { userId: number }) => {
  const { data: session, isLoading, error } = useGetCurrentSession(userId);

  if (isLoading) return <div>Loading session...</div>;
  if (error) return <div>Error loading session</div>;

  return <div>Session: {session?.type}</div>;
};
```

##### `useUpdateSession()`
Updates the current session.

```typescript
import { useUpdateSession } from '../services/v2/sessionV2';

const UpdateSessionComponent = () => {
  const updateSessionMutation = useUpdateSession();

  const handleUpdateSession = (userData: any) => {
    updateSessionMutation.mutate(userData, {
      onSuccess: (data) => {
        console.log('Session updated successfully:', data);
      },
      onError: (error) => {
        console.error('Failed to update session:', error);
      }
    });
  };

  return (
    <button 
      onClick={() => handleUpdateSession(userData)}
      disabled={updateSessionMutation.isPending}
    >
      {updateSessionMutation.isPending ? 'Updating...' : 'Update Session'}
    </button>
  );
};
```

## Migration Guide

To migrate from the original services:

1. Replace direct function calls with React Query hooks
2. Use the `mutate` method for mutations instead of calling functions directly
3. Handle loading states with `isLoading` or `isPending`
4. Use `onSuccess` and `onError` callbacks for side effects
5. Remove manual error handling as it's handled by React Query
6. Replace axios with native fetch API (already done in v2)

## Benefits of React Query Implementation

1. **Automatic Caching**: Data is cached and shared across components
2. **Loading States**: Built-in loading states for better UX
3. **Error Handling**: Centralized error handling with proper error callbacks
4. **Cache Invalidation**: Automatic cache management
5. **Optimistic Updates**: Framework ready for optimistic updates
6. **Retry Logic**: Built-in retry mechanisms for failed requests
7. **Background Refetching**: Automatic background updates
8. **Stale Time Management**: Configurable cache invalidation
9. **Query Keys**: Organized cache management with query keys
10. **No External HTTP Client**: Uses native fetch API 