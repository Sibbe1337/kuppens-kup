import React from 'react'
import { render, screen } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import AdminDashboard from '@/app/admin/dashboard/page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    }
  },
}))

const queryClient = new QueryClient()

describe('AdminDashboard', () => {
  it('renders loading state', () => {
    render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      </SessionProvider>
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders dashboard for admin users', () => {
    render(
      <SessionProvider session={{ user: { role: 'admin' } }}>
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      </SessionProvider>
    )
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Track Management')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('User Management')).toBeInTheDocument()
  })
})

