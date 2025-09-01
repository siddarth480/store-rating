"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface Store {
  id: string;
  name: string;
  address: string;
}

export default function UserDashboard() {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      const { data } = await supabase.from("stores").select("id, name, address");
      setStores(data || []);
    };
    fetchStores();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <p className="mb-6 text-gray-600">Browse stores and leave your ratings!</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((s) => (
          <div
            key={s.id}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{s.name}</h2>
            <p className="text-gray-600 mb-4">{s.address}</p>
            <a
              href={`/stores/${s.id}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Rate This Store
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
