"use client";

import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import StoryList from "@/components/StoryList";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { PaginatedStoriesResponse, Story } from "@/types";

export default function BookmarksPage() {
  const { user, token } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookmarks = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError("");
      const response = await apiRequest<PaginatedStoriesResponse>(
        `/api/stories/bookmarks?page=${page}&limit=10`,
        { token }
      );
      setStories(response.stories);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookmarks");
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  const handleToggleBookmark = useCallback(
    async (storyId: string) => {
      if (!token) return;
      await apiRequest(`/api/stories/${storyId}/bookmark`, {
        method: "POST",
        token,
      });
      await fetchBookmarks();
    },
    [token, fetchBookmarks]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchBookmarks();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchBookmarks]);

  return (
    <ProtectedRoute>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Your Bookmarks</h1>
          <button
            onClick={fetchBookmarks}
            type="button"
            className="rounded bg-gray-900 px-3 py-1.5 text-sm text-white"
          >
            Refresh
          </button>
        </div>

        {loading && <p className="text-gray-600">Loading bookmarks...</p>}
        {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

        {!loading && !error && (
          <>
            <StoryList
              stories={stories}
              user={user}
              token={token}
              onToggleBookmark={handleToggleBookmark}
              emptyMessage="No bookmarked stories yet."
              isBookmarksPage={true}
            />

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </ProtectedRoute>
  );
}
