"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SkeletonLoader from "./components/SkeletonLoader"; // Ensure this path is correct

export const dynamic = "force-dynamic"; // For always fetching fresh data

async function fetchProducts(page = 1) {
  const skip = (page - 1) * 20;
  const res = await fetch(
    `https://next-ecommerce-api.vercel.app/products?skip=${skip}&limit=20`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default function ProductsPage({ searchParams }) {
  const [loading, setLoading] = useState(true); // State to track loading
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const page = searchParams.page || 1;

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true); // Start loading
        const fetchedProducts = await fetchProducts(page);
        setProducts(fetchedProducts); // Set the products once fetched
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false); // End loading
      }
    }

    loadProducts();
  }, [page]);

  if (loading) {
    return <SkeletonLoader />; // Display SkeletonLoader while loading
  }

  if (error) {
    return <p>{error}</p>; // Handle error if fetching fails
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-stone-100">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-stone-200 bg-stone-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-40 w-full object-contain"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {product.title}
              </h2>
              <p className="text-green-600 font-bold mt-2">${product.price}</p>
              <p className="text-gray-500 text-sm">{product.category}</p>
              <Link
                href={`/${product.id}`}
                className="inline-block mt- px-1 py-1 bg-green-600 text-white rounded hover:bg-green-900"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={page} />
    </div>
  );
}

function Pagination({ currentPage }) {
  const pageNum = parseInt(currentPage, 10);
  const prevPage = pageNum > 1 ? pageNum - 1 : null;
  const nextPage = pageNum + 1;

  return (
    <div className="flex justify-between items-center mt-8">
      {prevPage && (
        <Link href={`/?page=${prevPage}`}>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300">
            Previous Page
          </button>
        </Link>
      )}
      <div className="text-gray-700">Page {currentPage}</div>
      <Link href={`/?page=${nextPage}`}>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300">
          Next Page
        </button>
      </Link>
    </div>
  );
}
