import { constructMetadata } from '@/lib/metadata';
import ContactClient from './ContactClient';

export const metadata = constructMetadata({
  title: 'Contact | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});

export default function Page() {
  return <ContactClient />;
}
