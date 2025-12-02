
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the login page
  redirect('/login');
  // Return null or an empty fragment as redirect handles the navigation
  return null;
}
