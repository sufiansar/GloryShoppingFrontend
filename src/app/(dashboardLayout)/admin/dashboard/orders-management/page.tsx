import React from "react";
import AdminOrdersDashboard from "@/components/modules/Admin/Orders/AdminOrdersDashboard";

const AdminOrdersPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-2">
          Manage and monitor customer orders, update statuses, and handle
          cancellations
        </p>
      </div>

      <AdminOrdersDashboard />
    </div>
  );
};

export default AdminOrdersPage;
