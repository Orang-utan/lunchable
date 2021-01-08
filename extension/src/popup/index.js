import ReactDOM from "react-dom";
import { initAmplitude } from "./util/amplitude";
import AppRouter from "./pages/AppRouter";

initAmplitude();

ReactDOM.render(<AppRouter />, document.getElementById("root"));
