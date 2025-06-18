import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, {useEffect} from 'react'
import { checkAuthentication } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { RootState } from '../store/store';


const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
export default PrivateRoute;