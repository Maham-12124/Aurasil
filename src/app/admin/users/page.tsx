import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRoleToggle } from "@/components/admin/user-role-toggle";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  return (
    <div>
      <h1 className="font-heading text-3xl">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {users.length} registered · {adminCount} admin{adminCount === 1 ? "" : "s"}
      </p>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  {user.name}
                  {session?.user?.id === user.id && (
                    <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">{user._count.orders}</td>
                <td className="px-4 py-3">
                  {new Date(user.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <UserRoleToggle
                    userId={user.id}
                    role={user.role}
                    isSelf={session?.user?.id === user.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">No users yet.</p>
        )}
      </div>
    </div>
  );
}
