import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

export function NoAccessPage() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <Card className="max-w-md text-center">
        <CardBody className="py-10">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#FBE0DA] text-[#A12A18]">
            <ShieldOff size={24} />
          </div>
          <h1 className="font-display text-3xl">No access</h1>
          <p className="mt-2 text-sm text-muted">
            Your current demo role cannot open this module. Return to the dashboard or sign in as another persona.
          </p>
          <Button asChild className="mt-6">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
