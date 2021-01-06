import ReactDOM from "react-dom";
import AppRouter from "./pages/AppRouter";

import { initAmplitude } from "./util/amplitude";

initAmplitude();

ReactDOM.render(<AppRouter />, document.getElementById("root"));
