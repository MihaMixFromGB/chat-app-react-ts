import { Navigate } from "react-router-dom";

interface RouteProps {
    isAuth: boolean,
    to: string,
    children: JSX.Element
}

export function PublicRoute({ isAuth, to="/", children }: RouteProps) {
    return (!isAuth ? children : <Navigate to={to} replace />);
};

export function PrivateRoute({ isAuth, to="/", children }: RouteProps) {
    return (!!isAuth ? children : <Navigate to={to} replace />);
};