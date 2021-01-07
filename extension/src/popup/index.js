import ReactDOM from "react-dom";
import { render } from "react-dom";
import AppRouter from "./pages/AppRouter";

import { initAmplitude } from "./util/amplitude";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { Store } from "webext-redux";

const store = new Store();

initAmplitude();

store.ready().then(() => {
  render(
    <Provider store={store}>
      <AppRouter />
    </Provider>,
    document.getElementById("root")
  );
});

// ReactDOM.render(<AppRouter />, document.getElementById("root"));
