import { constructMetadata } from '@/lib/metadata';
import Image from "next/image";
import {  Calendar } from "@gravity-ui/icons";
import EditProfileDialog from "./EditProfileDialog";
import { getServerSession } from "@/lib/sessions/serverSession";
import { Metadata } from 'next';


export const metadata = constructMetadata({
  title: 'Dashboard | Profile | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});






const page = async () => {
  const user = await getServerSession() ;


  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-[#2B2420] dark:text-[#F4EDE4]">
        Profile
      </h1>
      <p className="mt-1 text-sm text-[#6B6155] dark:text-[#B8AFA2]">
        Manage how you appear on Recipely.
      </p>

      <div className="mt-8 rounded-2xl border border-[#EAE0D3] bg-white p-6 sm:p-8 dark:border-[#3A332A] dark:bg-[#252019]">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#E85D3D] bg-[#FBF1E6] dark:bg-[#1A1714]">
            {user?.image ? (
              <Image src={user.image} alt={user.name} fill className="object-cover" />
            ) : null}
          </div>

          <div className="flex-1">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
              <h2 className="text-xl font-semibold text-[#2B2420] dark:text-[#F4EDE4]">
                {user?.name}
              </h2>

            </div>

            <p className="mt-1 text-sm text-[#9C9388]">{user?.email}</p>

            {user?.createdAt ? (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[#9C9388] sm:justify-start">
                <Calendar width={13} height={13} />
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}
              </p>
            ) : null}
          </div>

          <div className="shrink-0">
            <EditProfileDialog user={user} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default page;