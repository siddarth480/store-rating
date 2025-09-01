"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

interface Store {
  id: string;
  name: string;
  address: string;
  email: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      const { data, error } = await supabase.from("stores").select("*");

      if (error) {
        console.error("Error fetching stores:", error);
      } else {
        setStores(data || []);
      }
      setLoading(false);
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Stores</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border rounded-lg px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Stores Grid */}
      {loading ? (
        <p className="text-gray-600">Loading stores...</p>
      ) : filteredStores.length === 0 ? (
        <p className="text-gray-500">No stores found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Link
              key={store.id}
              href={`/stores/${store.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-xl transition border border-gray-100 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {store.name}
              </h2>
              <p className="text-gray-600">{store.address}</p>
              <p className="text-sm text-gray-400">{store.email}</p>
              <span className="mt-4 inline-block text-blue-600 font-medium hover:underline">
                View Details →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
