import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session } = useSession()

  const navigation = [
    { name: "Home", href: "/", roles: ["Tradesman", "Foreman", "Admin"] },
    { name: "Job Review", href: "/foreman/job-review", roles: ["Foreman", "Admin"] },
    { name: "Asset List", href: "/assets", roles: ["Foreman", "Admin"] },
    { name: "Profile", href: "/profile", roles: ["Tradesman", "Foreman", "Admin"] },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground">
        <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            Job Management System
          </Link>
          <div className="flex items-center space-x-4">
            {navigation.map(
              (item) =>
                session?.user?.role &&
                item.roles.includes(session.user.role) && (
                  <Link key={item.name} href={item.href}>
                    <Button variant="ghost">{item.name}</Button>
                  </Link>
                ),
            )}
            {session ? (
              <Button variant="outline" onClick={() => signOut()}>
                Sign out
              </Button>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline">Sign in</Button>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-gray-100">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
          © 2023 Job Management System. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

