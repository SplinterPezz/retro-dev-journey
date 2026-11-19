import { Outlet, Navigate } from 'react-router';
import { useEffect } from 'react'
import { checkAuthentication } from '../../store/authSlice';
import { ROUTES } from '../../config/routes';
import { useAppDispatch, useAppSelector } from '../../store/hooks';


const PrivateRoute = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);

  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.login} replace />;
};
export default PrivateRoute;