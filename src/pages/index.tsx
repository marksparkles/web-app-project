import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import TradesmanDashboard from "@/components/dashboard/TradesmanDashboard"
import ForemanDashboard from "@/components/dashboard/ForemanDashboard"
import AdminDashboard from "@/components/dashboard/AdminDashboard"

export default function Home() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState([])
  const [users, setUsers] = useState([])
  const [assets, setAssets] = useState([])
  const [pendingReviews, setPendingReviews] = useState(0)

  useEffect(() => {
    if (session?.user?.role) {
      fetchJobs()
      if (session.user.role === "Admin") {
        fetchUsers()
        fetchAssets()
      }
      if (session.user.role === "Foreman" || session.user.role === "Admin") {
        fetchPendingReviews()
      }
    }
  }, [session])

  const fetchJobs = async () => {
    const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false })
    if (error) console.error("Error fetching jobs:", error)
    else setJobs(data)
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*")
    if (error) console.error("Error fetching users:", error)
    else setUsers(data)
  }

  const fetchAssets = async () => {
    const { data, error } = await supabase.from("assets").select("*")
    if (error) console.error("Error fetching assets:", error)
    else setAssets(data)
  }

  const fetchPendingReviews = async () => {
    const { count, error } = await supabase
      .from("jobs")
      .select("*", { count: "exact" })
      .eq("status", "submitted")
      .eq("is_reviewed_accurate", false)
    if (error) console.error("Error fetching pending reviews:", error)
    else setPendingReviews(count || 0)
  }

  if (!session) {
    return <div>Please sign in to access the dashboard.</div>
  }

  switch (session.user.role) {
    case "Tradesman":
      return <TradesmanDashboard jobs={jobs} />
    case "Foreman":
      return <ForemanDashboard jobs={jobs} pendingReviews={pendingReviews} />
    case "Admin":
      return <AdminDashboard jobs={jobs} users={users} assets={assets} />
    default:
      return <div>Invalid user role.</div>
  }
}

