import { useQuery } from "react-query";
import api from "../api";

import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";

function IndexPage() {
  const { isLoading, error, data } = useQuery("users", () =>
    api.get("/api/users").then((res) => {
      console.log(res);
      return res.data;
    })
  );

  return (
    <div className="dash-container">
      <br />
      <div className="h1">Welcome back</div>
    </div>
  );
}

export default IndexPage;

// <header className="hero">
//   <div className="hero-body">
//     <h1 className="title">Hello world: Index</h1>
//     <h2 className="subtitle">
//       A list of users retrieved from <code>/api/users</code>.
//     </h2>
//   </div>
// </header>;
// {
//   isLoading ? (
//     "Loading..."
//   ) : error ? (
//     <p style={{ color: "red" }}>An error occurred! {error}</p>
//   ) : (
//     <div className="is-flex is-flex-wrap-wrap">
//       {data.result.map((user) => (
//         <article key={user.id} className="box m-2">
//           <p className="has-text-weight-bold">
//             {user.firstName} {user.lastName}
//           </p>
//           <p>{user.email}</p>
//         </article>
//       ))}
//     </div>
//   );
// }
// <footer className="section">
//   To be filled in with the actual app, soon! :)
// </footer>;
