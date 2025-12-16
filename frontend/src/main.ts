import "./style.css";
import "webix/webix.css";
import { getAccountView } from "./views/account/account";
import { getNotificationsView } from "./views/notification/notifications";
import {
  getThemeView,
  loadWebixSkin,
  applyPrimaryColorToWebix,
  applyFontFamilyToWebix,
} from "./views/theme";
import { getPrivacyView } from "./views/privacy/privacy";
import { getSidebar } from "./components/sidebar";
import { API_BASE_URL } from "./config";

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
        // Load theme settings first, before creating UI
        loadThemeSettings(webix).then(() => {
          // Create views after theme is loaded
          createUI(webix);
        });
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

// Function to load and apply theme settings on page load
async function loadThemeSettings(webix: any) {
  try {
    const response = await webix
      .ajax()
      .get(`${API_BASE_URL}/users/1/theme/`);
    const data = response.json();

    if (data) {
      // Load the skin
      if (data.skin) {
        if (
          data.primary_color === "default" ||
          !data.primary_color
        ) {
          // Load skin without custom colors (use skin defaults)
          loadWebixSkin(data.skin);
        } else {
          // Load skin with custom primary color
          loadWebixSkin(
            data.skin,
            data.primary_color
          );
        }
      }

      // Apply primary color if it's not "default"
      if (
        data.primary_color &&
        data.primary_color !== "default"
      ) {
        applyPrimaryColorToWebix(
          data.primary_color,
          data.skin
        );
      }

      // Apply font family to Webix components
      applyFontFamilyToWebix(
        data.font_family || "default"
      );
    }
  } catch (err) {
    console.error(
      "Failed to load theme settings on startup:",
      err
    );
    // Load default theme if API fails
    loadWebixSkin("material");
  }
}

// Function to create the UI
function createUI(webix: any) {
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
        ...getSidebar(webix, (id: string) => {
          const multiview = webix.$$(
            "mainContent"
          );
          if (multiview) {
            multiview.setValue(id);
          }

          // When Notifications is selected, explicitly trigger its onShow handler
          if (id === "notifications") {
            const notifView = webix.$$(
              "notifications"
            );
            if (notifView) {
              notifView.callEvent("onShow", []);
            }
          }

          // When Theme is selected, explicitly trigger its onShow handler
          if (id === "theme") {
            const themeView = webix.$$("theme");
            if (themeView) {
              themeView.callEvent("onShow", []);
            }
          }
        }),
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
            // Theme page
            ...themeView,
            id: "theme",
          },
          {
            // Privacy page
            ...privacyView,
            id: "privacy",
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
}

initWebix();
