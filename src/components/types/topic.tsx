export interface TopicType {
  id: string;
  name: string;
  username: string;
}

export interface TopicListType {
  content: TopicType[];
  number: number;
  totalPages: number;
  size: number;
}
