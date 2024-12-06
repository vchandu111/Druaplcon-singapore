import React, { useEffect, useState } from "react";
import Loader from "../Common/Loader";

const ShopByCategory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    // API call
    fetch(
      "https://main-bvxea6i-dzghxlrwlqmsu.us-2.platformsh.site/jsonapi/taxonomy_term/category"
    )
      .then((res) => res.json())
      .then((out) => {
        setData(out.data);
        setLoading(false); // Disable loading when data is fetched
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setLoading(false); // Disable loading even if there's an error
      });
  }, []);

  return (
    <>
      <h2 className="text-3xl font-bold text-center mt-24">
        Popular Categories
      </h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-black p-4">
          {data.map((category) => (
            <div
              key={category.id}
              className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-center text-lg font-semibold text-gray-700 hover:shadow-xl hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              {category.attributes.name}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ShopByCategory;
