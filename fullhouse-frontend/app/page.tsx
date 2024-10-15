import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold mb-2">Full House</h1>
        <div className="flex justify-center mb-4">
          <HomeIcon className="h-6 w-6 mr-2" />
        </div>
        <p className="text-gray-600 mb-6 max-w-sm">
          Find your roommate for the summer / post-graduation
        </p>
        <div className="space-y-4">
          <Button className="w-full" variant="default">
            Login
          </Button>
          <Button className="w-full" variant="outline">
            Sign up
          </Button>
        </div>
      </div>
    </div>
  )
}