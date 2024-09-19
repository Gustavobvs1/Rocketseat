import { useQuery } from '@tanstack/react-query';
import { CreateGoal } from './components/create-goal';
import { EmptyGoals } from './components/empty-goals';
import { Summary } from './components/summary';
import { Dialog } from './components/ui/dialog';
import { getSummary } from './http/get-summary';

export function App() {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60,
  });

  if (!data) {
    return null;
  }

  return (
    <Dialog>
      {data?.summary.total && data.summary.total > 0 ? (
        <Summary summary={data.summary} />
      ) : (
        <EmptyGoals />
      )}

      <CreateGoal />
    </Dialog>
  );
}
