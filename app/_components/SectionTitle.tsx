import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionTitleProps {
  title: string;
  viewAllLink?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, viewAllLink }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold" style={{ color: "#222222" }}>
        {title}
      </h2>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
};

export default SectionTitle;
