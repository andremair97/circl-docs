// Minimal company card placeholder. Structured similar to ProductCard for
// future expansion.
export interface Company {
  id: string;
  name: string;
  logo?: string;
}

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <div
      data-testid="company-card"
      className="flex flex-col items-center rounded border border-soft-border bg-surface p-2"
    >
      {company.logo ? (
        <img
          src={company.logo}
          alt={company.name}
          className="mb-2 h-16 w-16 rounded-full object-cover"
        />
      ) : (
        <div className="mb-2 h-16 w-16 rounded-full bg-bg" />
      )}
      <p className="text-sm font-semibold">{company.name}</p>
    </div>
  );
}

