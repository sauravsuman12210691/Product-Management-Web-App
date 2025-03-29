import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/slices/productSlice";
import { fetchUserDetails } from "../store/slices/authSlice";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const { items, status, error } = useSelector((state) => state.products);
  const authToken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [searchCategory, setSearchCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    rating: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);
  useEffect(()=>{

    dispatch(fetchUserDetails());
  },[])

  useEffect(() => {
    dispatch(fetchProducts({ category: searchCategory, minPrice }));
  }, [dispatch, searchCategory, minPrice]);

  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProductId) {
      dispatch(updateProduct({ productId: editingProductId, productData }));
      setEditingProductId(null);
    } else {
      dispatch(createProduct(productData));
    }
    setProductData({ name: "", description: "", category: "", price: "", rating: "" });
  };

  const handleEdit = (product) => {
    setProductData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      rating: product.rating,
    });
    setEditingProductId(product._id);
  };

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Product Dashboard</h2>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right">
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          )}
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by category"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-2">{editingProductId ? "Edit Product" : "Create Product"}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name" value={productData.name} onChange={handleInputChange} required className="p-2 border rounded" />
          <input type="text" name="description" placeholder="Description" value={productData.description} onChange={handleInputChange} required className="p-2 border rounded" />
          <input type="text" name="category" placeholder="Category" value={productData.category} onChange={handleInputChange} required className="p-2 border rounded" />
          <input type="number" name="price" placeholder="Price" value={productData.price} onChange={handleInputChange} required className="p-2 border rounded" />
          <input type="number" step="0.1" name="rating" placeholder="Rating" value={productData.rating} onChange={handleInputChange} required className="p-2 border rounded" />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded col-span-2">{editingProductId ? "Update Product" : "Create Product"}</button>
        </form>
      </div>

      {status === "loading" && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((product) => (
            <tr key={product._id} className="text-center">
              <td className="border p-2">{product._id}</td>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.description}</td>
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">${product.price}</td>
              <td className="border p-2">{product.rating}</td>
              <td className="border p-2">{new Date(product.createdAt).toLocaleString()}</td>
              <td className="border p-2 flex gap-2 justify-center">
                <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
