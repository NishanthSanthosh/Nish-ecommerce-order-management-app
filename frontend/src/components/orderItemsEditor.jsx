import LineItemsEditor from "./lineItemsEditor";

export default function OrderItemsEditor({
  products,
  items,
  setItems,
  originalItems = [],
}) {
  return (
    <LineItemsEditor
      catalogItems={products}
      lineItems={items}
      setLineItems={setItems}
      originalLineItems={originalItems}
      itemIdKey="productId"
      title="Order Items"
      description="Add each product and quantity. Quantity cannot exceed available stock."
      selectLabel="Product"
      addButtonLabel="Add Item"
      totalLabel="Order Total"
      getCatalogItemId={(product) => product._id}
      getCatalogItemName={(product) => product.product}
      getCatalogItemPrice={(product) => Number(product.price)}
      getCatalogItemStock={(product) => Number(product.stock)}
      getOriginalItemId={(item) => String(item.productId?._id || item.productId)}
      getOriginalItemQuantity={(item) => Number(item.quantity)}
    />
  );
}
