import { constructMetadata } from '@/lib/metadata';
// app/dashboard/admin/items/[id]/edit/page.tsx
import { getPizzaById } from '@/lib/api/pizza';
import EditPizzaForm from './EditPizzaForm';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';


export const metadata = constructMetadata({
  title: 'Dashboard | Admintems | [id] | Edit | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});


interface Props {
    params: Promise<{ id: string }>;
}

export default async function PizzaEditPage({ params }: Props) {
    const { id } = await params;
    const pizza = await getPizzaById(id);

    if (!pizza) {
        notFound();
    }

    return <EditPizzaForm pizza={pizza} />;
}