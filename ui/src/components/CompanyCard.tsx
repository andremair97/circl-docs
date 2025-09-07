interface Props {
  name: string;
}

// CompanyCard is a simple placeholder for future company renderings.
export default function CompanyCard({ name }: Props) {
  return (
    <div
      data-testid="company-card"
      className="rounded border border-soft-border bg-surface p-4"
    >
      <h3 className="font-semibold">{name}</h3>
    </div>
  );
}
