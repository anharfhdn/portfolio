export const STATUS_OPTIONS = [
  { value: "published", label: "Publish" },
  { value: "draft", label: "Move to Draft" },
  { value: "archived", label: "Archive" },
] as const;

export type PublishStatus = (typeof STATUS_OPTIONS)[number]["value"];
