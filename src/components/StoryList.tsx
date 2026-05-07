"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Story, User } from "@/types";

type StoryListProps = {
  stories: Story[];
  user: User | null;
  token: string | null;
  onToggleBookmark?: (storyId: string) => Promise<void>;
  emptyMessage: string;
  isBookmarksPage?: boolean;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
};

function StoryItem({
  story,
  user,
  token,
  onToggleBookmark,
  isBookmarksPage,
  onRequireAuth,
}: {
  story: Story;
  user: User | null;
  token: string | null;
  onToggleBookmark?: (storyId: string) => Promise<void>;
  isBookmarksPage?: boolean;
  onRequireAuth: () => void;
}) {
  const [isBookmarked, setIsBookmarked] = useState(
    user ? story.bookmarkedBy.includes(user.id) : false
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!user || !token) {
      onRequireAuth();
      return;
    }
    if (!onToggleBookmark) return;
    setIsLoading(true);
    try {
      await onToggleBookmark(story._id);
      setIsBookmarked((prev) => !prev);
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="rounded border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            <a href={story.url} target="_blank" rel="noreferrer" className="hover:underline">
              {story.title}
            </a>
          </h3>
          <p className="text-sm text-gray-600">
            {story.points} points by {story.author}
          </p>
          <p className="text-xs text-gray-500">Posted: {formatDate(story.postedAt)}</p>
        </div>

        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          <Link
            href={`/stories/${story._id}`}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
          >
            View Details
          </Link>
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`rounded px-3 py-1.5 text-sm transition-colors ${
              isBookmarked
                ? isBookmarksPage
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-900 text-white hover:bg-gray-800"
            } disabled:opacity-50`}
            type="button"
          >
            {isLoading 
              ? "Loading..." 
              : isBookmarked 
                ? isBookmarksPage ? "Remove Bookmark" : "Bookmarked" 
                : "Toggle Bookmark"}
          </button>
        </div>
      </div>
    </li>
  );
}

export default function StoryList({
  stories,
  user,
  token,
  onToggleBookmark,
  emptyMessage,
  isBookmarksPage,
}: StoryListProps) {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState("");

  const handleRequireAuth = () => {
    setToastMessage("Please login to bookmark stories.");
    setTimeout(() => setToastMessage(""), 3000);
    router.push("/login");
  };

  if (!stories.length) {
    return <p className="rounded border border-gray-200 p-4 text-gray-600">{emptyMessage}</p>;
  }

  return (
    <>
    <ul className="space-y-3">
      {stories.map((story) => (
        <StoryItem
          key={story._id}
          story={story}
          user={user}
          token={token}
          onToggleBookmark={onToggleBookmark}
          isBookmarksPage={isBookmarksPage}
          onRequireAuth={handleRequireAuth}
        />
      ))}
    </ul>
    
    {/* Toast Notification */}
    {toastMessage && (
      <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white shadow-lg transition-opacity">
        {toastMessage}
      </div>
    )}
    </>
  );
}
