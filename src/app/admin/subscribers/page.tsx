import { prisma } from "@/lib/prisma";
import { DeleteSubscriberButton } from "@/components/admin/delete-subscriber-button";

export const revalidate = 0;

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl">Subscribers</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {subscribers.length} newsletter subscriber{subscribers.length === 1 ? "" : "s"} — emailed
        automatically whenever a new product is added.
      </p>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Subscribed</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{subscriber.email}</td>
                <td className="px-4 py-3">
                  {new Date(subscriber.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteSubscriberButton subscriberId={subscriber.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">No subscribers yet.</p>
        )}
      </div>
    </div>
  );
}
