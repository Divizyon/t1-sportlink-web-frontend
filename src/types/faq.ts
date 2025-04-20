export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorId?: string;
  authorName?: string;
  viewCount?: number;
  tags?: string[];
}
