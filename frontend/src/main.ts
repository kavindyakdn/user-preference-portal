import "./style.css";
import "webix/webix.css";
import { getAccountView } from "./views/account/account";
import { getNotificationsView } from "./views/notification/notifications";
import { getThemeView } from "./views/theme";
import { getPrivacyView } from "./views/privacy/privacy";
import { getSidebar } from "./components/sidebar";

// Ensure app container has proper styling
// const app = document.getElementById("app");
// if (app) {
//   app.style.width = "100%";
//   app.style.height = "100vh";
// }

// Dynamically import Webix
async function initWebix() {
  try {
    const webixModule = await import(
      "webix/webix.js"
    );
    const webix =
      webixModule.default || webixModule;

    if (webix && webix.ready) {
      webix.ready(() => {
        // Create views
        const accountView = getAccountView(webix);
        const notificationsView =
          getNotificationsView(webix);
        const themeView = getThemeView(webix);
        const privacyView = getPrivacyView(webix);

        webix.ui({
          container: "app",
          cols: [
            {
              // Left Sidebar
              ...getSidebar(
                webix,
                (id: string) => {
                  const multiview = webix.$$(
                    "mainContent"
                  );
                  if (multiview) {
                    multiview.setValue(id);
                  }
                }
              ),
            },
            {
              // Main Content Area
              view: "multiview",
              id: "mainContent",
              cells: [
                {
                  ...accountView,
                  id: "account",
                },
                {
                  // Notifications page
                  ...notificationsView,
                  id: "notifications",
                },
                {
                  id: "theme",
                  view: themeView.view,
                  template: themeView.template,
                },
                {
                  id: "privacy",
                  view: privacyView.view,
                  template: privacyView.template,
                  css: privacyView.css,
                },
              ],
            },
          ],
        });

        // Select first menu item by default
        const menu = webix.$$("sidebarMenu");
        if (menu) {
          menu.select("account");
        }
      });
    } else {
      console.error(
        "Webix ready method not found"
      );
    }
  } catch (error) {
    console.error("Error loading Webix:", error);
  }
}

initWebix();
