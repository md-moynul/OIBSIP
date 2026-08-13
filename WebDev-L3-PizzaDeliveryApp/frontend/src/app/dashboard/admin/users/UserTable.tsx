"use client";

import Image from "next/image";
import { Person } from "@gravity-ui/icons";

// Define the shape of a single User
export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
  isPremium?: boolean;
  isBlocked?: boolean;
}

// Define the component Props
interface UserTableProps {
  users: User[];
}

function StatusBadge({ isBlocked }: { isBlocked?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isBlocked
          ? "bg-[#FBE9E7] text-[#C0392B] dark:bg-[#3A1F1B] dark:text-[#E8897A]"
          : "bg-[#E6F4EA] text-[#1E7B3C] dark:bg-[#1E3B2A] dark:text-[#6FCF8E]"
      }`}
    >
      {isBlocked ? "Blocked" : "Active"}
    </span>
  );
}

function RoleBadge({ role }: { role?: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F2EDE4] px-2.5 py-0.5 text-xs font-medium capitalize text-[#6B6155] dark:bg-[#2A251E] dark:text-[#9C9388]">
      {role ?? "user"}
    </span>
  );
}

export default function UserTable({ users }: UserTableProps) {
  if (!users || users.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-[#EAE0D3] p-12 text-center dark:border-[#3A332A]">
        <p className="text-sm font-medium text-[#2B2420] dark:text-[#F4EDE4]">
          No users found
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-[#EAE0D3] shadow-sm dark:border-[#3A332A]">
      <table className="w-full bg-white dark:bg-[#252019]">
        <thead className="border-b border-[#EAE0D3] dark:border-[#3A332A]">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#9C9388] dark:text-[#8A8074]">
              User
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#9C9388] dark:text-[#8A8074]">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#9C9388] dark:text-[#8A8074]">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#9C9388] dark:text-[#8A8074]">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => {
            const id = u._id ?? u.id;

            return (
              <tr
                key={id}
                className="group border-b border-[#EAE0D3]/60 transition-colors last:border-0 hover:bg-[#FBF1E6]/60 dark:border-[#3A332A]/60 dark:hover:bg-[#1A1714]/60"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#FBF1E6] ring-1 ring-[#EAE0D3] dark:bg-[#1A1714] dark:ring-[#3A332A]">
                      {u.image ? (
                        <Image
                          src={u.image}
                          alt={u.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#C9BFAF]">
                          <Person width={14} height={14} />
                        </div>
                      )}
                    </div>
                    <span className="truncate text-sm font-medium text-[#2B2420] dark:text-[#F4EDE4]">
                      {u.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="text-sm text-[#6B6155] dark:text-[#B8AFA2]">
                    {u.email}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge isBlocked={u.isBlocked} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}