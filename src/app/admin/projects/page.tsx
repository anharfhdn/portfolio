import AdminProjectsClient from "./AdminProjectsClient";

export default async function Page() {
  const rawAdmins = process.env.ADMIN_ADDRESSES || "";
  const adminArray = rawAdmins.split(",").map((addr) => addr.trim());

  return <AdminProjectsClient adminAddresses={adminArray} />;
}
