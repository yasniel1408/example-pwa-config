import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import App from "./App";

import reportWebVitals from "./reportWebVitals";

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorkerRegistration.register();
reportWebVitals();
