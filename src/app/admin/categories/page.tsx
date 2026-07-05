import { prisma } from "@/lib/prisma";
import { getAllCategories } from "@/lib/categories";
import { AddCategoryForm } from "@/components/admin/add-category-form";
import { CategoryRow } from "@/components/admin/category-row";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const [categories, counts] = await Promise.all([
    getAllCategories(),
    prisma.product.groupBy({ by: ["category"], _count: true }),
  ]);
  const countByName = new Map(counts.map((c) => [c.category, c._count]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl">Categories</h1>
      </div>

      <div className="mt-6">
        <AddCategoryForm />
      </div>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                id={category.id}
                name={category.name}
                image={category.image}
                productCount={countByName.get(category.name) ?? 0}
              />
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
