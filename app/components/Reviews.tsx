"use client";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Review {
  id: number;
  user_id: number;
  username: string;
  content: string;
  created_at: string;
}

interface Rating {
  imdb_id: string;
  user_id: number;
  rating: number;
}

interface ReviewsProps {
  movieId: number;
  token?: string | null;
  type?: "movie" | "series";
}

export default function Reviews({ movieId, token }: ReviewsProps) {
  const { token: contextToken, user } = useContext(AuthContext);
  const actualToken = token || contextToken;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);


  // --- Log aktuálneho používateľa z kontextu
  useEffect(() => {
    console.log("Current user from context:", user);
  }, [user]);

  // --- Načítanie recenzií a hodnotení ---
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchReviewsAndRatings = async () => {
    try {
      console.log("Fetching reviews and ratings for movieId:", movieId);

      // --- Reviews ---
      const resReviews = await fetch(`${apiUrl}/api/reviews?movie_id=${movieId}`);
      const dataReviews = await resReviews.json();
      console.log("Reviews fetched:", dataReviews);
      setReviews(dataReviews);

      // --- Ratings ---
      const resRatings = await fetch(`${apiUrl}/api/ratings/${movieId}`);
      const dataRatings = await resRatings.json();
      console.log("Ratings fetched:", dataRatings);
      setRatings(dataRatings);

    } catch (err) {
      console.error("Failed to fetch reviews or ratings:", err);
    }
  };


  useEffect(() => {
    fetchReviewsAndRatings();
  }, [movieId]);

  // --- Pridanie novej recenzie ---
  const handleAddReview = async () => {
    if (!actualToken || !newReview.trim()) return;
    setLoading(true);
    console.log("Adding review:", newReview, "Token:", actualToken);

    try {
      const res = await fetch(`${apiUrl}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${actualToken}`,
        },
        body: JSON.stringify({ movie_id: movieId, content: newReview }),
      });



      const data = await res.json(); // <-- načítame JSON z backendu

      if (!res.ok) throw new Error(data.error || "Failed to add review");
      // <-- použije správu z backendu, ak existuje, inak default

      console.log("Review added successfully");
      await fetchReviewsAndRatings();
      setNewReview("");
    } catch (err: any) {
      console.error(err);

      // Tu môžeš pridať kreatívnu hlášku
      alert(err.message || "Please behave! Your review contains inappropriate language.");
    } finally {
      setLoading(false);
    }
  };


  // --- Vracia rating používateľa podľa user_id ---
  const getUserRating = (user_id: number) => {
    const ratingObj = ratings.find((r) => r.user_id === user_id);
    return ratingObj ? ratingObj.rating : null;
  };

  // --- Otvorenie modal pre mazanie ---
  const openDeleteModal = (reviewId: number) => {
    console.log("Opening delete modal for reviewId:", reviewId);
    setSelectedReviewId(reviewId);
    setModalOpen(true);
  };

  // --- Zatvorenie modal ---
  const closeModal = () => {
    setSelectedReviewId(null);
    setModalOpen(false);
  };

  // --- Mazanie recenzie ---
  const handleDeleteReview = async () => {
    if (!actualToken || selectedReviewId === null) return;
    console.log("Deleting reviewId:", selectedReviewId, "Token:", actualToken);

    try {
      const res = await fetch(`${apiUrl}/api/reviews/${selectedReviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${actualToken}` },
      });


      console.log("Delete response:", res);
      if (!res.ok) throw new Error("Failed to delete review");

      await fetchReviewsAndRatings();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
    }
  };

  // --- Jednotlivá bublina recenzie ---
  const ReviewBubble = ({ review }: { review: Review }) => {
    const isOwnReview = user?.id === review.user_id;

    return (
      <div className="relative p-0 bg-gray-900 rounded-xl shadow-md border border-gray-700 hover:bg-gray-800 transition break-words max-h-[300px] flex flex-col">
        {/* Horný panel */}
        <div className="flex justify-between items-start p-3 bg-gray-950 rounded-t-xl sticky top-0 z-10">
          <div>
            <span className="font-bold animate-gradient-red text-xl">{review.username}</span>
            <span className="block text-red-300 text-xs mt-2">
              {new Date(review.created_at).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {getUserRating(review.user_id) !== null && (
              <span className="text-yellow-400 font-bold bg-gray-700 px-2 py-1 rounded flex-shrink-0">
                {getUserRating(review.user_id)} ⭐
              </span>
            )}

            {/* --- Zobraz X button len ak je to vlastná recenzia --- */}
            {isOwnReview && (
              <button
                onClick={() => openDeleteModal(review.id)}
                className="text-red-500 hover:text-red-400 font-bold text-lg"
              >
                X
              </button>
            )}
          </div>
        </div>

        {/* Text recenzie */}
        <div className="p-3 overflow-y-auto max-h-[230px] bg-gray-900 rounded-b-xl">
          <p className="text-gray-100 whitespace-pre-wrap">{review.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-10 lg:w-[80%] mx-auto">
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">Reviews</h2>

      {/* Form na pridanie recenzie */}
      {actualToken && (
        <div className="mb-6 p-4 bg-gray-900 rounded-lg shadow-md border border-gray-700">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-3 rounded bg-gray-700 text-white resize-none focus:outline-none focus:ring-2 focus:ring-red-900 placeholder-gray-100 placeholder:text-xl"
            rows={7}
          />
          <div className="flex justify-center mt-2">
            <button
              onClick={handleAddReview}
              disabled={loading}
              className="px-4 py-2 my-2 w-[220px] bg-red-700 hover:bg-red-600 rounded transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Grid s recenziami */}
      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet.</p>
      ) : (
        <div className="grid gap-5 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewBubble key={r.id} review={r} />
          ))}
        </div>
      )}

      {/* --- Modal pre potvrdenie mazania --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded shadow-lg text-center max-w-sm w-full">
            <p className="text-gray-200 mb-4">Are you sure you want to delete this review?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteReview}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-white"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
