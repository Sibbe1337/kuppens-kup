import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function LicenseSuccess() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">License Purchase Successful!</h1>
      <p className="mb-6">Thank you for your purchase. You can now use the licensed track in your project.</p>
      <p className="mb-6">A confirmation email has been sent to your email address with the license details and download instructions.</p>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  )
}

