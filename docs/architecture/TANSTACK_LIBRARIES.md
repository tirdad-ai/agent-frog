# TanStack Libraries Integration ✅

## 🎯 Philosophy: Use Battle-Tested Libraries

**Don't reinvent data management, use TanStack ecosystem.**

- ✅ **TanStack Query** - Server state management (replaces custom fetch logic)
- ✅ **TanStack Table** - Data tables (replaces custom table implementations)
- ✅ **TanStack Virtual** - Virtualization for large lists
- ✅ **TanStack Router** - Type-safe routing (if not using Next.js)

---

## 📦 Installation

```bash
# Core libraries (MANDATORY)
pnpm add @tanstack/react-query @tanstack/react-table

# Dev tools
pnpm add -D @tanstack/react-query-devtools @tanstack/eslint-plugin-query

# Optional (as needed)
pnpm add @tanstack/react-virtual
pnpm add @tanstack/react-router  # If not using Next.js
```

---

## 🔄 TanStack Query (React Query)

### Purpose
**Server state management** - ALL API calls, caching, mutations, background refetching.

### Setup

```typescript
// apps/web/src/app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Usage Patterns

#### Basic Query

```typescript
// lib/hooks/use-users.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiClient.get<User>(`/users/${userId}`),
    enabled: !!userId, // Only run if userId exists
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get<User[]>('/users'),
  });
}
```

#### Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => 
      apiClient.post<User>('/users', data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      apiClient.put<User>(`/users/${id}`, data),
    onMutate: async ({ id, data }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['user', id] });
      const previous = queryClient.getQueryData(['user', id]);
      queryClient.setQueryData(['user', id], data);
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['user', variables.id], context?.previous);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
}
```

#### Pagination

```typescript
export function useUsers(page: number) {
  return useQuery({
    queryKey: ['users', page],
    queryFn: () => apiClient.get<PaginatedResponse<User>>(`/users?page=${page}`),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}
```

#### Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfiniteUsers() {
  return useInfiniteQuery({
    queryKey: ['users', 'infinite'],
    queryFn: ({ pageParam }) =>
      apiClient.get<PaginatedResponse<User>>(`/users?page=${pageParam}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.prevPage,
  });
}

// Usage in component
function UsersList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUsers();

  return (
    <div>
      {data?.pages.map((page) =>
        page.data.map((user) => <UserCard key={user.id} user={user} />)
      )}
      <Button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading...' : 'Load More'}
      </Button>
    </div>
  );
}
```

### Component Usage

```typescript
// ✅ CORRECT
import { useUser } from '@/lib/hooks/use-users';
import { Skeleton } from '@repo/ui/base/skeleton';
import { Alert } from '@repo/ui/base/alert';

export function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <Skeleton className="h-20 w-full" />;
  if (error) return <Alert variant="destructive">{error.message}</Alert>;
  if (!user) return <Alert>User not found</Alert>;

  return <div>{user.name}</div>;
}

// ❌ WRONG: Manual state management
export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);
  // Don't do this!
}
```

---

## 📊 TanStack Table

### Purpose
**Data tables** with sorting, filtering, pagination - ALL tables should use this.

### Setup DataTable Component

```typescript
// packages/ui/src/components/custom/data-table/data-table.tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../base/table';
import { Button } from '../../base/button';
import { Input } from '../../base/input';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchable?: boolean;
  searchKey?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchable = false,
  searchKey = '',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      {searchable && (
        <Input
          placeholder={`Search ${searchKey}...`}
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

### Define Columns

```typescript
// apps/web/src/app/[locale]/users/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@repo/ui/base/button';
import { Badge } from '@repo/ui/base/badge';
import { ArrowUpDown } from 'lucide-react';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Badge variant={row.original.role === 'admin' ? 'default' : 'secondary'}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === 'active' ? 'success' : 'destructive'}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
            Delete
          </Button>
        </div>
      );
    },
  },
];
```

### Use in Pages

```typescript
// apps/web/src/app/[locale]/users/page.tsx
import { DataTable } from '@repo/ui/custom/data-table';
import { useUsers } from '@/lib/hooks/use-users';
import { userColumns } from './columns';
import { Skeleton } from '@repo/ui/base/skeleton';

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <DataTable
        columns={userColumns}
        data={users || []}
        searchable
        searchKey="users"
      />
    </div>
  );
}
```

---

## 📜 TanStack Virtual

### Purpose
**Virtualization** for large lists (1000+ items) - Only render visible items.

### Installation

```bash
pnpm add @tanstack/react-virtual
```

### Usage

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Estimated height of each item
  });

  return (
    <div
      ref={parentRef}
      className="h-96 overflow-auto border rounded-md"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Quality Checklist

### TanStack Query
- [ ] Installed in root provider
- [ ] All API calls use TanStack Query (no useState + useEffect)
- [ ] Query keys are well-structured: `['resource', id/filter]`
- [ ] Mutations invalidate related queries
- [ ] Loading/error states handled
- [ ] DevTools enabled in development

### TanStack Table
- [ ] DataTable component in `packages/ui/custom/`
- [ ] All tables use DataTable (no custom HTML tables)
- [ ] Columns defined with proper types (ColumnDef)
- [ ] Sorting, filtering, pagination enabled
- [ ] Combined with TanStack Query for data fetching

### TanStack Virtual
- [ ] Used for lists with 1000+ items
- [ ] Proper height estimation
- [ ] Works with TanStack Query

---

## 🚫 What NOT to Do

❌ Don't use `useState` + `useEffect` for server state
❌ Don't build custom data fetching logic
❌ Don't create custom table implementations
❌ Don't render 1000+ items without virtualization
❌ Don't use other state management libraries for server state

---

## 📚 Resources

- **TanStack Query**: https://tanstack.com/query
- **TanStack Table**: https://tanstack.com/table
- **TanStack Virtual**: https://tanstack.com/virtual
- **TanStack Router**: https://tanstack.com/router

---

**See `.agent-prompts/senior-frontend-agent-prompt.md` for complete patterns**
