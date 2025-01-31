export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <p className="mb-8 font-mono">Get started by editing src/app/page.tsx</p>

      <div className="space-y-8">
        <div>
          <a href="https://nextjs.org/docs" className="text-[#60A5FA] hover:underline block">
            Docs →
          </a>
          <p className="text-gray-400 mt-1">Find in-depth information about Next.js features and API.</p>
        </div>

        <div>
          <a href="https://nextjs.org/learn" className="text-[#60A5FA] hover:underline block">
            Learn →
          </a>
          <p className="text-gray-400 mt-1">Learn about Next.js in an interactive course with quizzes!</p>
        </div>

        <div>
          <a href="https://vercel.com/templates" className="text-[#60A5FA] hover:underline block">
            Templates →
          </a>
          <p className="text-gray-400 mt-1">Explore the Next.js 13 playground.</p>
        </div>

        <div>
          <a href="https://vercel.com/new" className="text-[#60A5FA] hover:underline block">
            Deploy →
          </a>
          <p className="text-gray-400 mt-1">Instantly deploy your Next.js site to a shareable URL with Vercel.</p>
        </div>
      </div>
    </main>
  )
}

