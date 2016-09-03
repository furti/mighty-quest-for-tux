import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppComponent } from './AppComponent';

let container = document.getElementById('app-container');

console.log(container);

ReactDOM.render(<AppComponent></AppComponent>, container);