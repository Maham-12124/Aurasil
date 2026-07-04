import { prisma } from "@/lib/prisma";
import { DeleteMessageButton } from "@/components/admin/delete-message-button";

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-heading text-3xl">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Submissions from the Contact Us page.
      </p>

      <div className="mt-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="border border-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading text-base">{message.subject}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {message.name} —{" "}
                  <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                    {message.email}
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xs text-muted-foreground">
                  {new Date(message.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <DeleteMessageButton messageId={message.id} />
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{message.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="border border-dashed border-border py-10 text-center text-muted-foreground">
            No messages yet.
          </p>
        )}
      </div>
    </div>
  );
}
