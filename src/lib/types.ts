export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiGroup {
  id: string;
  title: string;
  course: string;
  location: string;
  startsAt: string;
  seats: number;
  description: string;
  createdAt: string;
  creatorName: string;
  memberCount: number;
  joinedByMe?: boolean;
  isCreator?: boolean;
}

export interface ApiMeResponse {
  user: User & { createdAt: string };
  createdGroups: ApiGroup[];
  joinedGroups: ApiGroup[];
}
