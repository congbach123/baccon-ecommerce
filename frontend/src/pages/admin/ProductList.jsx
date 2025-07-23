import React from "react";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../slices/productSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { useParams } from "react-router-dom";
const ProductList = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });
  const navigate = useNavigate();
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();
  const handleCreateProduct = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch();
        toast.success("Product created successfully!");
      } catch (err) {
        toast.error(`Failed to create product: ${err.message}`);
      }
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/product/${productId}/edit`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId).unwrap();
        refetch();
        toast.success("Product deleted successfully!");
      } catch (err) {
        toast.error(`Failed to delete product: ${err.message}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">
              Product Management
            </h1>
          </div>

          {/* Use Loader component instead of skeleton */}
          <div className="bg-white rounded-2xl shadow-soft p-16">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
            <div className="text-red-500 text-lg font-medium mb-2">
              Error loading products
            </div>
            <div className="text-gray-600">
              {error?.data?.message || "Something went wrong"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">
            Product Management
          </h1>

          <button
            onClick={handleCreateProduct}
            className="inline-flex items-center px-6 py-3 bg-coal text-white font-medium rounded-xl hover:bg-charcoal transition-colors shadow-soft"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          {data.products && data.products.length > 0 ? (
            <>
              {/* Table Header */}
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-7 gap-4 items-center text-sm font-medium text-gray-700">
                  <div>Image</div>
                  <div>ID</div>
                  <div>Name</div>
                  <div>Category</div>
                  <div>Brand</div>
                  <div>Price</div>
                  <div>Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {data.products.map((product, index) => (
                  <div
                    key={product._id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                    onClick={() => handleEditProduct(product._id)}
                  >
                    <div className="grid grid-cols-7 gap-4 items-center">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl shadow-soft"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/64x64?text=No+Image";
                          }}
                        />
                      </div>

                      {/* Product ID */}
                      <div className="text-sm text-gray-600 font-mono">
                        {product._id.slice(-8)}
                      </div>

                      {/* Product Name */}
                      <div className="font-medium text-gray-900 truncate">
                        {product.name}
                      </div>

                      {/* Category */}
                      <div className="text-sm text-gray-600">
                        {product.category}
                      </div>

                      {/* Brand */}
                      <div className="text-sm text-gray-600">
                        {product.brand}
                      </div>

                      {/* Price */}
                      <div className="font-medium text-gray-900">
                        ${product.price?.toFixed(2)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProduct(product._id);
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-coal bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product._id);
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first product.
              </p>
              <button
                onClick={handleCreateProduct}
                className="inline-flex items-center px-6 py-3 bg-coal text-white font-medium rounded-xl hover:bg-charcoal transition-colors shadow-soft"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Your First Product
              </button>
            </div>
          )}
        </div>

        <Pagination pages={data.pages} page={data.page} isAdmin={true} />

        {/* Footer Info */}
        {data.products && data.products.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 text-center">
            Showing {data.products.length} products
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
