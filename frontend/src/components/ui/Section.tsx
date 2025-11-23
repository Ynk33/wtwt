import { cn } from '@utils/cn';

const Section = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('border border-gray-200 rounded-sm p-4', className)}>
      {children}
    </div>
  );
};

export default Section;
