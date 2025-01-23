import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

interface User {
  id: string
  email: string
  role: string
}

export default function UserManagement() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "" })

  useEffect(() => {
    if (session?.user?.role === "Admin") {
      fetchUsers()
    }
  }, [session])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*").order("email", { ascending: true })

      if (error) throw error

      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const addUser = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
      })

      if (error) throw error

      if (data.user) {
        const { error: roleError } = await supabase.from("users").update({ role: newUser.role }).eq("id", data.user.id)

        if (roleError) throw roleError

        setUsers([...users, { id: data.user.id, email: data.user.email, role: newUser.role }])
        setNewUser({ email: "", password: "", role: "" })
      }
    } catch (error) {
      console.error("Error adding user:", error)
      setError("Failed to add user")
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId)

      if (error) throw error

      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    } catch (error) {
      console.error("Error updating user role:", error)
      setError("Failed to update user role")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (session?.user?.role !== "Admin") return <div>Access denied. Admin rights required.</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tradesman">Tradesman</SelectItem>
                <SelectItem value="Foreman">Foreman</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addUser}>Add User</Button>
          </div>
        </CardContent>
      </Card>
      {users.map((user) => (
        <Card key={user.id} className="mb-2">
          <CardContent className="flex justify-between items-center">
            <div>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
            <Select value={user.role} onValueChange={(value) => updateUserRole(user.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tradesman">Tradesman</SelectItem>
                <SelectItem value="Foreman">Foreman</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

