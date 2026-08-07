import { constructMetadata } from '@/lib/metadata';
import SignInClient from './SignInClient';

export const metadata = constructMetadata({
  title: 'Auth | Signin | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});

export default function Page() {
  return <SignInClient />;
}
