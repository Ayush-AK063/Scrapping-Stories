"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Story } from "@/types";

export default function SingleStoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStory() {
      try {
        setLoading(true);
        const data = await apiRequest<Story>(`/api/stories/${id}`);
        setStory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch story");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchStory();
  }, [id]);

  if (loading) return <div className="p-4 text-gray-600">Loading story details...</div>;
  if (error) return <div className="p-4 text-red-600 bg-red-50 rounded">{error}</div>;
  if (!story) return <div className="p-4 text-gray-600">Story not found.</div>;

  return (
    <section className="mx-auto mt-8 max-w-2xl space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      <button 
        onClick={() => router.back()} 
        className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-900"
      >
        &larr; Back to List
      </button>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{story.title}</h1>
        
        <div className="flex flex-wrap gap-4 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
          <p><strong>Author:</strong> {story.author}</p>
          <p><strong>Points:</strong> {story.points}</p>
          <p><strong>Posted:</strong> {new Date(story.postedAt).toLocaleString()}</p>
          <p><strong>Hacker News ID:</strong> {story.hnId}</p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <a 
            href={story.url} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Read Original Article ↗
          </a>
        </div>
      </div>
    </section>
  );
}
