import type { Product } from '../types/Product';

// ProductCard renders a product with optional image, brand and eco badges.
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div
      data-testid="product-card"
      className="flex flex-col rounded border border-soft-border bg-surface p-2"
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.title}
          className="mb-2 h-32 w-full rounded object-cover"
        />
      ) : (
        <div className="mb-2 flex h-32 w-full items-center justify-center rounded bg-bg text-xs text-gray-500">
          No image
        </div>
      )}
      <h3 className="text-sm font-semibold">{product.title}</h3>
      <p className="text-xs text-gray-700" data-testid="brand">
        {product.brand}
      </p>
      {product.badges.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {product.badges.map((b) => (
            <span
              key={b}
              className="rounded bg-bg px-1 py-0.5 text-[10px] text-gray-700"
            >
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

