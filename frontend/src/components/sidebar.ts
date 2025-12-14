export function getSidebar(
  webix: any,
  onMenuSelect: (id: string) => void
) {
  return {
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
          onAfterSelect: function (id: string) {
            onMenuSelect(id);
          },
        },
        css: "sidebar_items",
      },
    ],
  };
}
