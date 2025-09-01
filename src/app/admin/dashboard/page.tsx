"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Store {
  id: string;
  name: string;
  address: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Fetch users and stores
  const fetchData = async () => {
    const { data: usersData } = await supabase.from("profiles").select("id, name, email, role");
    const { data: storesData } = await supabase.from("stores").select("id, name, address");
    setUsers(usersData || []);
    setStores(storesData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !storeAddress) return;

    setLoading(true);
    setMsg("");

    const { error } = await supabase.from("stores").insert([{ name: storeName, address: storeAddress }]);
    if (error) {
      setMsg(`Error: ${error.message}`);
    } else {
      setMsg("Store added successfully!");
      setStoreName("");
      setStoreAddress("");
      fetchData();
    }
    setLoading(false);
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Stores</h2>
          <p className="text-3xl font-bold text-green-600">{stores.length}</p>
        </div>
      </div>

      {/* Add Store Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Store</h2>
        {msg && <p className="mb-4 text-sm text-green-600">{msg}</p>}
        <form onSubmit={handleAddStore} className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            required
          />
          <input
            type="text"
            placeholder="Store Address"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Adding..." : "Add Store"}
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden mb-10">
        <h2 className="text-xl font-semibold bg-gray-100 px-6 py-3">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{u.name}</td>
                  <td className="p-3 border-b">{u.email}</td>
                  <td className="p-3 border-b">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h2 className="text-xl font-semibold bg-gray-100 px-6 py-3">Stores</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Address</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{s.name}</td>
                  <td className="p-3 border-b">{s.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
