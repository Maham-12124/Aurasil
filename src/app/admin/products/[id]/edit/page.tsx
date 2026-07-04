import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "@/app/admin/products/actions";
import { getProductById } from "@/lib/products";
import { getCategoryNames } from "@/lib/categories";

export const revalidate = 0;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategoryNames()]);
  if (!product) notFound();

  const boundUpdateProduct = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="font-heading text-3xl">Edit Product</h1>
      <div className="mt-8">
        <ProductForm product={product} categories={categories} action={boundUpdateProduct} />
      </div>
    </div>
  );
}
