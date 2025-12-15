import "./theme.css";

export function getThemeView(webix: any) {
  return {
    view: "form",
    id: "themeForm",
    scroll: true,
    elements: [
      {
        view: "template",
        template: `
          <div class="theme-header">
            <div class="theme-title">Theme Settings</div>
            <div class="theme-subtitle">
              Personalize how your preferences portal looks and feels.
            </div>
          </div>
        `,
        height: 80,
        borderless: true,
      },
      {
        view: "fieldset",
        label: "Theme mode",
        body: {
          rows: [
            {
              cols: [
                {
                  view: "label",
                  label: "Mode",
                  width: 120,
                },
                {
                  view: "segmented",
                  name: "theme_mode",
                  value: "light",
                  options: [
                    {
                      id: "light",
                      value: "Light",
                    },
                    { id: "dark", value: "Dark" },
                  ],
                  css: "theme-segmented",
                  on: {
                    onChange: function (
                      value: string
                    ) {
                      document.body.setAttribute(
                        "data-theme",
                        value
                      );
                      const preview =
                        document.querySelector(
                          ".theme-preview"
                        ) as HTMLElement | null;
                      if (preview) {
                        preview.setAttribute(
                          "data-theme",
                          value
                        );
                      }
                    },
                  },
                },
              ],
            },
          ],
        },
      },
      {
        view: "fieldset",
        label: "Accent color",
        body: {
          rows: [
            {
              view: "template",
              height: 100,
              template: `
                <div class="theme-color-row">
                  <div class="theme-color-text">
                    <div class="theme-color-label">Primary color</div>
                    <div class="theme-color-description">
                      This accent color is used for highlights and primary actions.
                    </div>
                  </div>
                  <div class="theme-color-picker-wrapper">
                    <input id="themeColorPicker" type="color" value="#4b7bec" />
                  </div>
                </div>
              `,
              on: {
                onAfterRender: function () {
                  const input =
                    document.getElementById(
                      "themeColorPicker"
                    ) as HTMLInputElement | null;
                  if (input) {
                    input.oninput = (e) => {
                      const target =
                        e.target as HTMLInputElement;
                      const color =
                        target.value || "#4b7bec";
                      document.documentElement.style.setProperty(
                        "--app-primary-color",
                        color
                      );
                    };
                  }
                },
              },
            },
          ],
        },
      },
      {
        view: "fieldset",
        label: "Font",
        body: {
          rows: [
            {
              cols: [
                {
                  view: "label",
                  label: "Font family",
                  width: 120,
                },
                {
                  view: "richselect",
                  name: "font_family",
                  value: "system",
                  options: [
                    {
                      id: "system",
                      value: "System default",
                    },
                    {
                      id: "sans",
                      value: "Sans Serif",
                    },
                    {
                      id: "serif",
                      value: "Serif",
                    },
                    {
                      id: "mono",
                      value: "Monospace",
                    },
                  ],
                  css: "theme-select",
                  on: {
                    onChange: function (
                      value: string
                    ) {
                      document.body.setAttribute(
                        "data-font",
                        value
                      );
                      const preview =
                        document.querySelector(
                          ".theme-preview"
                        ) as HTMLElement | null;
                      if (preview) {
                        preview.setAttribute(
                          "data-font",
                          value
                        );
                      }
                    },
                  },
                },
              ],
            },
          ],
        },
      },
      {
        // Live preview block
        view: "template",
        borderless: true,
        // height: auto,
        template: `
          <div class="theme-preview">
            <div class="theme-preview-title">Preview</div>
            <div class="theme-preview-subtitle">
              This is how your settings page will generally look.
            </div>
            <div class="theme-preview-card">
              <div class="theme-preview-card-title">Sample card title</div>
              <div class="theme-preview-card-text">
                Body text adapts to your font and color preferences.
              </div>
              <button class="theme-preview-button">Primary action</button>
            </div>
          </div>
        `,
      },
    ],
  };
}
