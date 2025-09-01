"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

interface Store {
  id: string;
  name: string;
  address: string;
  email: string;
}

interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    id: string;
    name: string;
  } | null;
}

export default function StoreDetails() {
  const params = useParams();
  const id = params?.id as string; // ✅ cast from useParams
  const [store, setStore] = useState<Store | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [newRating, setNewRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch store + ratings
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // Get store details
      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("*")
        .eq("id", id)
        .single();

      if (storeError) console.error(storeError);
      else setStore(storeData);

      // Get ratings with profile (instead of users)
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("ratings")
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          profiles (
            id,
            name
          )
        `
        )
        .eq("store_id", id)
        .order("created_at", { ascending: false });

      if (ratingsError) console.error(ratingsError);
      else setRatings(ratingsData || []);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  // Submit new rating
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to leave a review.");
      return;
    }

    // Insert new rating
    const { error } = await supabase.from("ratings").insert([
      {
        store_id: id,
        user_id: user.id,
        rating: newRating,
        comment,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error submitting review.");
    } else {
      setComment("");
      setNewRating(0);

      // Refresh ratings
      const { data: ratingsData } = await supabase
        .from("ratings")
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          profiles (
            id,
            name
          )
        `
        )
        .eq("store_id", id)
        .order("created_at", { ascending: false });

      setRatings(ratingsData || []);
    }
  };

  if (loading) {
    return <p className="p-8 text-gray-600">Loading...</p>;
  }

  if (!store) {
    return <p className="p-8 text-red-500">Store not found</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Store Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-blue-600">{store.name}</h1>
        <p className="text-gray-700 mt-2">{store.address}</p>
        <p className="text-gray-500">{store.email}</p>
      </div>

      {/* Ratings Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Ratings</h2>

        {/* New Rating Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`text-3xl ${
                  newRating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setNewRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </form>

        {/* Ratings List */}
        <div className="space-y-4">
          {ratings.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            ratings.map((r) => (
              <div
                key={r.id}
                className="bg-white p-4 shadow rounded-lg border border-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-600">
                    {r.profiles?.name || "Anonymous"}
                  </span>
                  <span className="text-yellow-500 font-medium">
                    ⭐ {r.rating}/5
                  </span>
                </div>
                <p className="text-gray-700">{r.comment}</p>
                <span className="text-xs text-gray-400">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
