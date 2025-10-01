import { Button } from '@heroui/react'
import { Link } from 'react-router'

const NotFound = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      <h2 className="mb-6 text-5xl font-semibold">404</h2>
      <h3 className="mb-1.5 text-3xl font-semibold">Page Not Found</h3>
      <p className="mb-6 max-w-sm">
        The page you're looking for isn't found, we suggest you back to home.
      </p>
      <Button as={Link} to="/">Back to home page</Button>
    </div>

  )
}

export default NotFound