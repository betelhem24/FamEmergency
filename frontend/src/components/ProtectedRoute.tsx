import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';

// This component takes another component (children) as a gift
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // I check the Redux Brain for a user
  const { user } = useSelector((state: RootState) => state.auth);

  // If there is no user, we kick them back to the Login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //  If there IS a user, we let them through to see the page
  return children;
};

export default ProtectedRoute;