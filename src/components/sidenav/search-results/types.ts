import { BadgeType } from '../../shared/components/badge/types.ts';

export interface SearchResultsProps {
  searchResults: SearchResult[];
  searchQuery: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: BadgeType;
}
