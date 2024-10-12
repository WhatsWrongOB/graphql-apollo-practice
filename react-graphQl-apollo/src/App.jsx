import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const getAllProducts = gql`
  query {
    getAllProducts {
      id
      name
      price
      category
    }
  }
`;

const createOneProduct = gql`
  mutation{
    createProduct(id: $id, name: $name, category: $category, price: $price) {
      id
      name
      price
      category
    }
  }
`;

const App = () => {
  const { data, loading, error } = useQuery(getAllProducts);
  const [createProduct] = useMutation(createOneProduct);

  const [product, setProduct] = useState({ id: "", name: "", category: "", price: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({ variables: { ...product, price: parseInt(product.price) } });
      window.location.reload();
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  if (error) return <p>Error Fetching Data: {error.message}</p>;

  return (
    <div>
      <h1>Fetch Products From GraphQL Server</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {data.getAllProducts.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">${item.price}</td>
                <td className="border px-4 py-2">{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label>
            ID:
            <input type="text" name="id" value={product.id} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Name:
            <input type="text" name="name" value={product.name} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Category:
            <input type="text" name="category" value={product.category} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input type="number" name="price" value={product.price} onChange={handleChange} required />
          </label>
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default App;
