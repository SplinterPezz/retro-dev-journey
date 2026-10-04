import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import React, {useEffect} from 'react'
import { checkAuthentication } from '../../store/authSlice';
import { useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { ROUTES } from '../../config/routes';


const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);

  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.login} replace />;
};
export default PrivateRoute;