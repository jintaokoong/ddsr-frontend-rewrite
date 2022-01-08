export interface Request {
  _id: string;
  name: string;
  done: boolean;
  details?: {
    title: string;
    url: string;
  };
  key: string;
  createdAt: number;
  updatedAt: number;
}
