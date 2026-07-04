import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/app/admin/products/actions";
import { getCategoryNames } from "@/lib/categories";

export const revalidate = 0;

export default async function NewProductPage() {
  const categories = await getCategoryNames();

  return (
    <div>
      <h1 className="font-heading text-3xl">New Product</h1>
      <div className="mt-8">
        <ProductForm categories={categories} action={createProduct} />
      </div>
    </div>
  );
}
