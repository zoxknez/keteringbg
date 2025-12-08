import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { SessionProvider } from 'next-auth/react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-neutral-950">
        <AdminSidebar />
        {/* Main content with responsive padding */}
        <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  )
}
