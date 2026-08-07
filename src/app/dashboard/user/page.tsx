import { redirect } from 'next/navigation';

export default function UserOverviewPage() {
  redirect('/dashboard/user/orders');
}