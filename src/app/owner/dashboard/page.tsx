"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface Store {
  id: string;
  name: string;
  address: string;
}

interface Rating {
  id: string;
  score: number;
  comment: string;
  user_id: string;
}

export default function OwnerDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Example: Fetch owner’s stores (replace with auth user id later)
      const { data: storesData } = await supabase.from("stores").select("id, name, address");
      setStores(storesData || []);

      const { data: ratingsData } = await supabase.from("ratings").select("*");
      setRatings(ratingsData || []);
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>

      {stores.map((store) => (
        <div key={store.id} className="mb-10 bg-white rounded-xl shadow-md">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">{store.name}</h2>
            <span className="text-gray-500">{store.address}</span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">Customer Ratings</h3>
            {ratings.length === 0 ? (
              <p className="text-gray-500">No ratings yet.</p>
            ) : (
              <ul className="space-y-3">
                {ratings.map((r) => (
                  <li key={r.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                    <p className="font-semibold">⭐ {r.score}/5</p>
                    <p className="text-gray-600">{r.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
