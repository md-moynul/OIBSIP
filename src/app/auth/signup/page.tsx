import { constructMetadata } from '@/lib/metadata';
import SignUpClient from './SignUpClient';

export const metadata = constructMetadata({
  title: 'Auth | Signup | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});

export default function Page() {
  return <SignUpClient />;
}
