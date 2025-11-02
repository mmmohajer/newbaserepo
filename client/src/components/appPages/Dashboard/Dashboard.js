import { useSelector } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div";

import AdminDashboard from "./subs/AdminDashboard";
import ClientDashboard from "./subs/ClientDashboard";

const Dashboard = () => {
  const profile = useSelector((state) => state.profile);
  return (
    <>
      {profile?.user?.groups?.includes("ADMIN") ? <AdminDashboard /> : null}
      {!profile?.user?.groups?.includes("ADMIN") &&
      profile?.user?.groups?.includes("CLIENT") ? (
        <ClientDashboard />
      ) : null}
    </>
  );
};

export default Dashboard;
