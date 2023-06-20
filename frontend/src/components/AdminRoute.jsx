import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Message from "./Message";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo && userInfo.isAdmin === true ? (
    <Outlet />
  ) : (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go back
      </Link>
      <Message vairant="danger" children="Only admins are allowed" />
    </>
  );
};

export default AdminRoute;
