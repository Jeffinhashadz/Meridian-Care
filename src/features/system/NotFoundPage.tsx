import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-ground px-4 text-center">
      <div>
        <p className="label-caps text-primary-signal">404</p>
        <h1 className="mt-2 font-display text-4xl">Page not found</h1>
        <p className="mt-2 text-muted">That route is not part of the Meridian demo.</p>
        <Button asChild className="mt-6">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
