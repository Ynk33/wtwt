import { Link } from 'react-router-dom';

interface MenuItemProps {
  to: string;
  children: React.ReactNode;
}

const MenuItem = ({ to, children }: MenuItemProps): React.ReactNode => {
  return (
    <div>
      <Link to={to}>{children}</Link>
    </div>
  );
};

export default MenuItem;
