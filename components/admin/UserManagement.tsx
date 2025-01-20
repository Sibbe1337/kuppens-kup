import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  role: string
  createdAt: string
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/admin/users')
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

async function updateUserRole(userId: string, role: string): Promise<User> {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  })
  if (!response.ok) {
    throw new Error('Failed to update user role')
  }
  return response.json()
}

async function banUser(userId: string): Promise<void> {
  const response = await fetch(`/api/admin/users/${userId}/ban`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('Failed to ban user')
  }
}

export function UserManagement() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: users, isLoading, isError } = useQuery(['adminUsers'], fetchUsers)

  const updateRoleMutation = useMutation(
    ({ userId, role }: { userId: string; role: string }) => updateUserRole(userId, role),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['adminUsers'])
        toast({ title: 'User role updated successfully' })
      },
      onError: () => {
        toast({ title: 'Failed to update user role', variant: 'destructive' })
      },
    }
  )

  const banUserMutation = useMutation(banUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers'])
      toast({ title: 'User banned successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to ban user', variant: 'destructive' })
    },
  })

  if (isLoading) return <div>Loading users...</div>
  if (isError) return <div>Error loading users</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    const newRole = user.role === 'user' ? 'admin' : 'user'
                    updateRoleMutation.mutate({ userId: user.id, role: newRole })
                  }}
                  className="mr-2"
                >
                  {user.role === 'user' ? 'Make Admin' : 'Remove Admin'}
                </Button>
                <Button
                  onClick={() => {
                    if (confirm('Are you sure you want to ban this user?')) {
                      banUserMutation.mutate(user.id)
                    }
                  }}
                  variant="destructive"
                >
                  Ban User
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

