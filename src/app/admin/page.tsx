import AdminClient from "./AdminClient";

export default async function Page() {
    const rawAdmins = process.env.ADMIN_ADDRESSES || "";
    const adminArray = rawAdmins.split(',').map(addr => addr.trim());

    return <AdminClient adminAddresses={adminArray} />;
}
