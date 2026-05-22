export type Issue = {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};