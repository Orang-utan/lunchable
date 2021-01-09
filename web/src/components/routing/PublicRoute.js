import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../../context";
import queryString from "query-string";

const PublicRoute = (props) => {
  const auth = useContext(AuthContext);

  // query string
  const parsedQuery = queryString.parse(props.location.search);
  const redirectUrl = parsedQuery.redirect;

  return auth.isAuthenticated ? (
    redirectUrl ? (
      <Redirect to={`${redirectUrl}`} />
    ) : (
      <Redirect to="/dashboard" />
    )
  ) : (
    <Route path={props.path} exact={props.exact} component={props.component} />
  );
};

export default PublicRoute;
