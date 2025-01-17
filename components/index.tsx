import Layout from '@/components/Layout'

export default function Home() {
  return (
    <Layout title="Home | Web App Project">
      <h1 className="text-3xl font-bold mb-4">Welcome to Web App Project</h1>
      <p className="mb-4">This is the skeleton structure of our application.</p>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Next Steps:</h2>
        <ul className="list-disc list-inside">
          <li>Add more pages to the application</li>
          <li>Implement user authentication</li>
          <li>Create and integrate API routes</li>
          <li>Add your custom components and features</li>
        </ul>
      </div>
    </Layout>
  )
}

