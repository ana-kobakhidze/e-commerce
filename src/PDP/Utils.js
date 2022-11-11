export const fetchExtendedProductAsync = async (
  client,
  productId,
  productQuery
) => {

  const product = await fetchProductFromServerAsync(
    client,
    productId,
    productQuery
  );

  return product && extendProduct(product);
};

const fetchProductFromServerAsync = async (client, productId, query) => {
  const { data } = await client.query({
    query: query,
    variables: { id: productId },
  });

  const { product } = data;
  return product;
};

const extendProduct = (product) => {
  let productCopy = { ...product };
  productCopy = extendProductWithCount(productCopy);
  productCopy = extendAttributesWithIsSelected(productCopy);
  return productCopy;
};

const extendProductWithCount = (product) => {
  return { ...product, count: 1, currentPosition: 0 };
};

const extendAttributesWithIsSelected = (product) => {
  const extendedAttributes = product.attributes.map((attribute) => {
    const extendedItems = attribute.items.map((item) => {
      return { ...item, isSelected: false };
    });
    return { ...attribute, items: extendedItems };
  });
  return { ...product, attributes: extendedAttributes };
};
