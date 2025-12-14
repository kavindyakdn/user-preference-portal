import "./style.css";
import "webix/webix.css";
import { getAccountView } from "./views/account";
import { getNotificationsView } from "./views/notifications";
import { getThemeView } from "./views/theme";
import { getPrivacyView } from "./views/privacy";

// Ensure app container has proper styling
const app = document.getElementById("app");
if (app) {
  app.style.width = "100%";
  app.style.height = "100vh";
}

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
              rows: [
                {
                  // Header with Logo and App Name
                  view: "template",
                  template: `
                    <div style="padding: 20px; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">⚙️</div>
                      <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
                        Preferences
                      </div>
                      <div style="font-size: 12px; color: #666;">
                        User Settings Portal
                      </div>
                    </div>
                  `,
                  height: 140,
                  css: "webix_dark",
                },
                {
                  // Navigation Menu
                  view: "menu",
                  id: "sidebarMenu",
                  width: 250,
                  data: [
                    {
                      id: "account",
                      icon: "wxi-user",
                      value: "Account",
                    },
                    {
                      id: "notifications",
                      icon: "wxi-bell",
                      value: "Notifications",
                    },
                    {
                      id: "theme",
                      icon: "wxi-palette",
                      value: "Theme",
                    },
                    {
                      id: "privacy",
                      icon: "wxi-lock",
                      value: "Privacy",
                    },
                  ],
                  layout: "y",
                  select: true,
                  on: {
                    onAfterSelect: function (
                      id: string
                    ) {
                      const multiview = webix.$$(
                        "mainContent"
                      );
                      if (multiview) {
                        multiview.setValue(id);
                      }
                    },
                  },
                },
              ],
            },
            {
              // Main Content Area
              view: "multiview",
              id: "mainContent",
              cells: [
                {
                  id: "account",
                  view: accountView.view,
                  template: accountView.template,
                  css: accountView.css,
                },
                {
                  id: "notifications",
                  view: notificationsView.view,
                  template:
                    notificationsView.template,
                  css: notificationsView.css,
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
