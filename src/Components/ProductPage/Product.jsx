import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Product = () => {
  const location = useLocation();
  const [productDetails, setProductDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null); // Track selected size

  const selfLink = location.state?.selfLink;

  useEffect(() => {
    if (selfLink) {
      fetch(
        `${selfLink}?include=variations,variations.attribute_color,variations.attribute_size,variations.field_image`
      )
        .then((res) => res.json())
        .then((data) => {
          const title = data.data.attributes.title;
          const body =
            data.data.attributes.body?.processed || "No description available.";
          const defaultVariationId =
            data.data.relationships.default_variation.data.id;
          const defaultVariation = data.included.find(
            (item) => item.id === defaultVariationId
          );
          const price = parseFloat(
            defaultVariation?.attributes?.price?.number || 0
          );

          const variationIds = data.data.relationships.variations.data.map(
            (variation) => variation.id
          );
          const variations = variationIds.map((id) =>
            data.included.find((item) => item.id === id)
          );

          const images = variations.map((variation) => {
            const imageId = variation?.relationships?.field_image?.data?.id;
            const image = data.included.find(
              (item) => item.id === imageId && item.type === "file--file"
            );
            return {
              url: image
                ? `https://main-bvxea6i-dzghxlrwlqmsu.us-2.platformsh.site${image.attributes.uri.url}`
                : null,
              color: variation?.relationships?.attribute_color?.data?.id,
              sizes: variation?.relationships?.attribute_size?.data
                ? [
                    data.included.find(
                      (item) =>
                        item.id ===
                        variation.relationships.attribute_size.data.id
                    )?.attributes?.name,
                  ]
                : [],
              id: variation?.id, // Add variation ID for the API request
              type: variation?.type, // Include type for the variation
            };
          });

          const product = {
            title,
            body,
            price,
            images,
          };

          setProductDetails(product);
          setSelectedImage(images[0]?.url); // Set the first image as default
          setAvailableSizes(images[0]?.sizes || []);
        })
        .catch((error) =>
          console.error("Error fetching product details:", error)
        );
    }
  }, [selfLink]);

  const handleImageChange = (image) => {
    setSelectedImage(image.url);
    setAvailableSizes(image.sizes);
  };

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => Math.max(1, prev + increment));
  };

  const handleAddToCart = () => {
    if (!productDetails || !selectedImage || !selectedSize) {
      alert("Please select a size and product option.");
      return;
    }

    // Find the selected variation
    const selectedVariation = productDetails.images.find(
      (image) => image.url === selectedImage
    );

    if (!selectedVariation?.id) {
      alert("Failed to add product to cart.");
      return;
    }

    // Get the type of the variation dynamically
    const variationType = selectedVariation.type;

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/vnd.api+json");
    myHeaders.append("Content-Type", "application/vnd.api+json");
    myHeaders.append("Commerce-Cart-Token", "9908");

    const raw = JSON.stringify({
      data: [
        {
          type: variationType, // Dynamically set type
          id: selectedVariation.id, // Use the variation ID
          meta: {
            quantity: quantity, // Use the selected quantity
            combine: true,
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://main-bvxea6i-dzghxlrwlqmsu.us-2.platformsh.site/jsonapi/cart/add",
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          alert("Item added to cart successfully!");
        } else {
          alert("Failed to add item to cart.");
        }
        return response.text();
      })
      .then((result) => console.log(result))
      .catch((error) => console.error("Error adding to cart:", error));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Product Details</h1>
      {productDetails ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-lg overflow-hidden p-8">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md aspect-square flex items-center justify-center border rounded-lg overflow-hidden">
                <img
                  src={selectedImage}
                  alt={productDetails.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-4 mt-4">
                {productDetails.images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${
                      selectedImage === image.url
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleImageChange(image)}
                  >
                    <img
                      src={image.url}
                      alt={`Variation ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                {productDetails.title}
              </h2>
              <p className="text-2xl text-green-600 font-bold mb-6">
                ${productDetails.price.toFixed(2)}
              </p>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Available Sizes:
              </h3>
              {availableSizes.length > 0 ? (
                <ul className="flex gap-2 flex-wrap mb-4">
                  {availableSizes.map((size, index) => (
                    <li
                      key={index}
                      className={`px-4 py-2 rounded-lg shadow text-sm cursor-pointer ${
                        selectedSize === size
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No sizes available for this color.
                </p>
              )}
              <p className="text-md font-medium mb-4">Quantity:</p>

              <div className="flex items-center gap-4 mb-6">
                <button
                  className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl font-bold"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <p className="text-2xl font-semibold">{quantity}</p>
                <button
                  className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl font-bold"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
              <button
                className="py-3 px-6 w-full bg-orange-600 text-white rounded-lg font-medium shadow hover:bg-orange-700 transition flex items-center justify-center gap-2"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
          <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Product Description
            </h3>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: productDetails.body }}
            />
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 text-lg">Loading...</p>
      )}
    </div>
  );
};

export default Product;
