export type User = {
  id: string;
  name: string;
  email: string;
};

export type Story = {
  _id: string;
  hnId: string;
  title: string;
  url: string;
  points: number;
  author: string;
  postedAt: string;
  bookmarkedBy: string[];
};

export type PaginatedStoriesResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  stories: Story[];
};
