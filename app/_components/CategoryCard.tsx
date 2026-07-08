import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  href: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  icon: Icon,
  href,
}) => {
  return (
    <Link href={href}>
      <Card className="flex flex-col items-center justify-center p-6 hover:shadow-md transition-shadow cursor-pointer group">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm font-medium text-center text-foreground capitalize">
          {name}
        </p>
      </Card>
    </Link>
  );
};

export default CategoryCard;
