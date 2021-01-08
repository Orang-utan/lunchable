import ReactDOM from "react-dom";
import AppRouter from "./pages/AppRouter";
import { initAmplitude } from "./util/amplitude";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";

initAmplitude();

ReactDOM.render(<AppRouter />, document.getElementById("root"));
