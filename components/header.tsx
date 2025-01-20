import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Music Licensing Platform
        </Link>
        <nav className="flex gap-4">
          <Button variant="outline">Sign In</Button>
          <Button>Sign Up</Button>
        </nav>
      </div>
    </header>
  )
}

