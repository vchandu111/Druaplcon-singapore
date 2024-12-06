import React, { useEffect, useState } from "react";
import Loader from "../Components/Common/Loader";
import { Link } from "react-router-dom";

function Shop() {
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Start loading

    fetch(
      `https://main-bvxea6i-dzghxlrwlqmsu.us-2.platformsh.site/jsonapi/index/products?include=variations,variations.attribute_color,variations.attribute_size,variations.field_image`
    )
      .then((res) => res.json())
      .then((out) => {
        const data = out.data;
        const included = out.included;
        const facets = out.meta.facets;
        const sizeFacet = facets.find((facet) => facet.id === "size");
        const colorFacet = facets.find((facet) => facet.id === "color");

        const sizes = sizeFacet
          ? sizeFacet.terms.map((term) => ({
              value: term.values.value,
              name: term.values.label,
              count: term.values.count,
            }))
          : [];

        setSizes(sizes);

        const colors = colorFacet
          ? colorFacet.terms.map((term) => ({
              value: term.values.value,
              name: term.values.label,
              count: term.values.count,
            }))
          : [];

        setColors(colors);
        console.log(colors);

        // Mapping product details including colors and sizes
        const productWithDetails = data.map((product) => {
          const defaultVariationId =
            product.relationships.default_variation.data.id;
          const defaultVariation = included.find(
            (item) => item.id === defaultVariationId
          );

          const imageId =
            defaultVariation?.relationships?.field_image?.data?.id;
          const image = included.find(
            (item) => item.id === imageId && item.type === "file--file"
          );

          const variationIds = product.relationships.variations.data.map(
            (v) => v.id
          );
          const variations = variationIds.map((id) =>
            included.find((item) => item.id === id)
          );

          const productColors = variations
            .map((variation) => {
              const colorId =
                variation?.relationships?.attribute_color?.data?.id;
              const color = included.find((item) => item.id === colorId);
              return color?.attributes?.name;
            })
            .filter(Boolean);

          const productSizes = variations
            .map((variation) => {
              const sizeId = variation?.relationships?.attribute_size?.data?.id;
              const size = included.find((item) => item.id === sizeId);
              return size?.attributes?.name;
            })
            .filter(Boolean);

          return {
            id: product.id,
            selfLink: product.links.self.href,
            title: product.attributes.title,
            price: parseFloat(defaultVariation?.attributes?.price?.number || 0),
            imageUrl: `https://main-bvxea6i-dzghxlrwlqmsu.us-2.platformsh.site${image?.attributes?.uri?.url}`,
            colors: [...new Set(productColors)],
            sizes: [...new Set(productSizes)],
          };
        });

        setProducts(productWithDetails);
        setFilteredProducts(productWithDetails); // Display all products initially
        setLoading(false); // Start loading
      });
  }, []);

  // useEffect(() => {
  //   fetch(
  //     "https://main-bvxea6i-dzghxlrwlqmsu.us-2.platformsh.site/jsonapi/commerce_product_attribute_value/size"
  //   )
  //     .then((res) => res.json())
  //     .then((out) => {
  //       const sizes = out.data.map((size) => ({
  //         id: size.id,
  //         name: size.attributes.name,
  //       }));
  //       setSizes(sizes);
  //     });
  //   fetch(
  //     "https://main-bvxea6i-dzghxlrwlqmsu.us-2.platformsh.site/jsonapi/commerce_product_attribute_value/color"
  //   )
  //     .then((res) => res.json())
  //     .then((out) => {
  //       const colors = out.data.map((color) => ({
  //         id: color.id,
  //         name: color.attributes.name,
  //       }));
  //       setColors(colors);
  //     });
  // }, []);

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes.some((size) => selectedSizes.includes(size))
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors.some((color) => selectedColors.includes(color))
      );
    }

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  const handleSizeChange = (sizeName) => {
    const updatedSizes = selectedSizes.includes(sizeName)
      ? selectedSizes.filter((size) => size !== sizeName)
      : [...selectedSizes, sizeName];
    setSelectedSizes(updatedSizes);
  };

  const handleColorChange = (colorName) => {
    const updatedColors = selectedColors.includes(colorName)
      ? selectedColors.filter((color) => color !== colorName)
      : [...selectedColors, colorName];
    setSelectedColors(updatedColors);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  useEffect(() => {
    filterProducts();
  }, [selectedSizes, selectedColors, sortOrder]);

  return (
    <>
      <div className="flex flex-col md:flex-row p-4 gap-8">
        <aside className="w-full md:w-1/4 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Filter by Size</h2>
          {sizes.map((size) => (
            <div key={size.id} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                onChange={() => handleSizeChange(size.name)}
                value={size.name}
                className="w-4 h-4"
              />
              <label className="text-sm">
                {size.name} ({size.count})
              </label>
            </div>
          ))}
          <h2 className="text-lg font-semibold mb-2 mt-6">Filter by Color</h2>
          {colors.map((color) => (
            <div key={color.id} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                onChange={() => handleColorChange(color.name)}
                value={color.name}
                className="w-4 h-4"
              />
              <label className="text-sm">
                {color.name} ({color.count})
              </label>
            </div>
          ))}
        </aside>
        <div className="flex-1">
          <div className="mb-4 flex justify-end">
            <label className="mr-2">Sort by Price:</label>
            <select
              className="border rounded-md px-3 py-1"
              onChange={handleSortChange}
              value={sortOrder}
            >
              <option value="default">Default</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 p-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <Link
                    to={`/shop/${product.id}`}
                    state={{ selfLink: product.selfLink }}
                  >
                    <div
                      key={index}
                      className="bg-white border rounded-lg shadow-md overflow-hidden transform transition hover:scale-105 hover:shadow-lg"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-48 object-contain p-4 "
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {product.title}
                        </h3>
                        <h5 className="text-green-600 font-bold text-lg">
                          ${product.price}
                        </h5>
                        <div className="mt-4">
                          <div className="flex gap-2">
                            {product.colors.map((color, idx) => (
                              <span
                                key={idx}
                                className="w-6 h-6 rounded-full"
                                style={{
                                  backgroundColor: color.toLowerCase(),
                                  border: "1px solid #ccc",
                                }}
                                title={color}
                              ></span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex gap-2">
                            {product.sizes.map((size, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 border rounded-md text-sm"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <button className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center col-span-3 text-red-500">
                  No products match your selected filters.
                </p>
              )}
            </div>
          )}
          {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-3 p-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-lg shadow-md overflow-hidden transform transition hover:scale-105 hover:shadow-lg"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-48 object-contain p-4 "
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.title}
                    </h3>
                    <h5 className="text-green-600 font-bold text-lg">
                      ${product.price}
                    </h5>
                    <div className="mt-4">
                      <div className="flex gap-2">
                        {product.colors.map((color, idx) => (
                          <span
                            key={idx}
                            className="w-6 h-6 rounded-full"
                            style={{
                              backgroundColor: color.toLowerCase(),
                              border: "1px solid #ccc",
                            }}
                            title={color}
                          ></span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex gap-2">
                        {product.sizes.map((size, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 border rounded-md text-sm"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <button className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 text-red-500">
                No products match your selected filters.
              </p>
            )}
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Shop;
