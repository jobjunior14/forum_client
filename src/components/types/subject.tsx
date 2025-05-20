export interface SubjectType {
  id: string;
  title: string;
  content: string;
  imagePath: string | null;
  username: string;
  createdAt: string;
}

export interface SubjectListType {
  content: SubjectType[];
  size: number;
  number: number;
  totalPages: number;
}
