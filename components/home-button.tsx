import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export function HomeButton() {
  return (
    <Link href="/">
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Button>
    </Link>
  )
}

