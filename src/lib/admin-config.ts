export const ADMIN_ENDPOINT = process.env.NEXT_PUBLIC_ADMIN_ENDPOINT || "admin";

export const getAdminPath = () => `/${ADMIN_ENDPOINT}`;
