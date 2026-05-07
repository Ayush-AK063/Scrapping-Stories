"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PaginatedStoriesResponse, Story } from "@/types";
import StoryList from "@/components/StoryList";

export default function Home() {
  const { user, token } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiRequest<PaginatedStoriesResponse>(
        `/api/stories?page=${page}&limit=10`
      );
      setStories(response.stories);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handleToggleBookmark = useCallback(
    async (storyId: string) => {
      if (!token) return;
      await apiRequest(`/api/stories/${storyId}/bookmark`, {
        method: "POST",
        token,
      });
    },
    [token]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchStories();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchStories]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Top Hacker News Stories</h1>
        <button
          onClick={fetchStories}
          type="button"
          className="rounded bg-gray-900 px-3 py-1.5 text-sm text-white"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading stories...</p>}
      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      {!loading && !error && (
        <>
          <StoryList
            stories={stories}
            user={user}
            token={token}
            onToggleBookmark={handleToggleBookmark}
            emptyMessage="No stories found."
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
  );
}
