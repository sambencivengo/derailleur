import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { DerailleurError } from '~/utils';

interface QueryErrorProps {
  errors: DerailleurError[];
}

export const QueryError = ({ errors }: QueryErrorProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      {errors.map((error, idx) => {
        return <AlertDescription key={idx}>{error.message}</AlertDescription>;
      })}
    </Alert>
  );
};
