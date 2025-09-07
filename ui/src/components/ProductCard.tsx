import type { Product } from '../mappers/offToProduct';

interface Props {
  product: Product;
}

// ProductCard displays product info with badges and optional image.
export default function ProductCard({ product }: Props) {
  const { image, title, brand, badges } = product;
  return (
    <div
      data-testid="product-card"
      className="rounded border border-soft-border bg-surface p-4"
    >
      {image ? (
        <img
          src={image}
          alt={title}
          className="mb-2 h-40 w-full object-cover"
        />
      ) : (
        <div
          data-testid="image-placeholder"
          className="mb-2 flex h-40 w-full items-center justify-center bg-bg text-sm text-gray-500"
        >
          No image
        </div>
      )}
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-700">{brand}</p>
      {badges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {badges.map((b) => (
            <span
              key={b}
              data-testid="badge"
              className="rounded bg-bg px-2 py-0.5 text-xs text-gray-700"
            >
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
