import ReactDOM from "react-dom";
import { initAmplitude } from "./util/amplitude";

initAmplitude();

ReactDOM.render(<AppRouter />, document.getElementById("root"));
