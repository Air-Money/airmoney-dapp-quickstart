import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AirMoneyModule } from "@airmoney-degn/react-ui";
import { createDefaultKeyEventManager } from "@airmoney-degn/controller-sdk";
import { App } from "./App";

const keyEventManager = createDefaultKeyEventManager();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AirMoneyModule.AirMoneyProvider keyEventManager={keyEventManager}>
      <AirMoneyModule.Layout version={import.meta.env.AIRMONEY_PACKAGE_VERSION} healthCheckUrls={["https://google.com"]}>
        <App />
      </AirMoneyModule.Layout>
    </AirMoneyModule.AirMoneyProvider>
  </StrictMode>
);
