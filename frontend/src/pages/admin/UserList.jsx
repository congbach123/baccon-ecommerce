import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery, useDeleteUserMutation } from "../slices/userSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const UserList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const usersPerPage = 10;

  const { data: users, isLoading, error, refetch } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users?.slice(indexOfFirstUser, indexOfLastUser) || [];
  const totalPages = Math.ceil((users?.length || 0) / usersPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle edit user
  const handleEditUser = (userId) => {
    navigate(`/admin/user/${userId}/edit`);
  };

  // Handle delete user - open modal
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  // Confirm delete user
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete._id).unwrap();
      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setUserToDelete(null);
      // Adjust current page if needed
      const newTotalUsers = users.length - 1;
      const newTotalPages = Math.ceil(newTotalUsers / usersPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Loading state
  if (isLoading) {
    return <Loader message="Loading users..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-200 max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-coal mb-4">
              Error Loading Users
            </h2>
            <p className="text-gray-600 mb-6">
              {error?.data?.message || "Failed to load users"}
            </p>
            <button
              onClick={refetch}
              className="w-full bg-coal text-white py-3 px-4 rounded-xl font-medium hover:bg-charcoal transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!users || users.length === 0) {
    return (
      <div className="min-h-screen bg-off-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-coal mb-2">Users</h1>
            <p className="text-gray-600">
              Manage user accounts and permissions
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-coal mb-2">
                No Users Found
              </h3>
              <p className="text-gray-600">
                There are no users in the system yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-coal mb-2">Users</h1>
          <p className="text-gray-600">
            Manage user accounts and permissions ({users.length} total users)
          </p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-coal">
                    Name
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-coal">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-coal">
                    Role
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-coal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-coal">{user.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-600">{user.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          user.isAdmin
                            ? "bg-coal text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user._id)}
                          className="bg-coal text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-charcoal transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstUser + 1} to{" "}
                  {Math.min(indexOfLastUser, users.length)} of {users.length}{" "}
                  users
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-coal text-white"
                            : "border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-large max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-red-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-coal mb-2">Delete User</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium text-coal">
                  {userToDelete?.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-gray-100 text-coal py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
