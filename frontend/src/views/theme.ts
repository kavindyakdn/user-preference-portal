import "./theme.css";
import { API_BASE_URL } from "../config";
import { getSaveButton } from "../components/save-button";

// Function to dynamically load Webix skin CSS
export function loadWebixSkin(
  skin: string,
  primaryColor?: string
) {
  // Remove existing skin link if any
  const existingLink = document.getElementById(
    "webix-skin-link"
  ) as HTMLLinkElement | null;
  if (existingLink) {
    existingLink.remove();
  }

  // Create new link element for the skin CSS
  const link = document.createElement("link");
  link.id = "webix-skin-link";
  link.rel = "stylesheet";
  link.href = `/node_modules/webix/skins/${skin}.css`;

  // After skin CSS loads, re-apply primary color if provided (and not "default")
  link.onload = () => {
    if (
      primaryColor &&
      primaryColor !== "default"
    ) {
      applyPrimaryColorToWebix(
        primaryColor,
        skin
      );
    }
  };

  document.head.appendChild(link);

  // If color is provided and link loads immediately, apply it (only if not "default")
  if (
    primaryColor &&
    primaryColor !== "default" &&
    link.sheet
  ) {
    applyPrimaryColorToWebix(primaryColor, skin);
  }
}

// Function to apply primary color to Webix components
export function applyPrimaryColorToWebix(
  primaryColor: string,
  skin?: string
) {
  // If primaryColor is "default", remove any custom color overrides
  // and let the skin's native CSS handle the colors
  if (primaryColor === "default") {
    // Remove custom color styles to use skin defaults
    const existingStyle = document.getElementById(
      "webix-custom-color"
    ) as HTMLStyleElement | null;
    if (existingStyle) {
      existingStyle.remove();
    }
    return;
  }

  // If not "default", apply the custom color
  const colorToApply = primaryColor;

  // Remove existing custom color style if any
  const existingStyle = document.getElementById(
    "webix-custom-color"
  ) as HTMLStyleElement | null;
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create style element with custom color overrides
  const style = document.createElement("style");
  style.id = "webix-custom-color";
  style.textContent = `
    /* Override Webix primary colors with custom color */
    .webix_button,
    .webix_el_button button {
      background-color: ${colorToApply} !important;
      border-color: ${colorToApply} !important;
    }
    
    .webix_button:hover,
    .webix_el_button button:hover {
      background-color: ${colorToApply} !important;
      opacity: 0.9;
    }
    
    .webix_selected,
    .webix_list_item.webix_selected,
    .webix_menu_item.webix_selected {
      background-color: ${colorToApply} !important;
    }
    
    .webix_menu_item.webix_selected .webix_icon {
      color: ${colorToApply} !important;
    }
    
    .webix_segment_0.webix_selected,
    .webix_segment_1.webix_selected {
      background-color: ${colorToApply} !important;
      border-color: ${colorToApply} !important;
    }
    
    .webix_radio_icon.webix_radio_checked {
      background-color: ${colorToApply} !important;
      border-color: ${colorToApply} !important;
    }
    
    .webix_switch_on {
      background-color: ${colorToApply} !important;
    }
    
    .webix_header .webix_header_content {
      background-color: ${colorToApply} !important;
    }
    
    .webix_toolbar .webix_img_btn:hover {
      background-color: ${colorToApply} !important;
    }
    
    /* Apply to CSS variable as well */
    :root {
      --app-primary-color: ${colorToApply};
    }
  `;
  document.head.appendChild(style);
}

export function getThemeView(webix: any) {
  return {
    view: "form",
    id: "theme",
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
        label: "Webix Skin",
        body: {
          rows: [
            {
              view: "radio",
              name: "skin",
              value: "material",
              options: [
                {
                  id: "material",
                  value: "Material",
                },
                { id: "mini", value: "Mini" },
                { id: "flat", value: "Flat" },
                {
                  id: "compact",
                  value: "Compact",
                },
                {
                  id: "contrast",
                  value: "Contrast",
                },
                { id: "willow", value: "Willow" },
              ],
              css: "theme-radio",
              on: {
                onChange: function (
                  value: string
                ) {
                  // When skin changes, set primary color to "default"
                  const form = webix.$$(
                    "theme"
                  ) as any;
                  if (form) {
                    // Update hidden field to track primary_color
                    const colorInput =
                      document.getElementById(
                        "primaryColorValue"
                      ) as HTMLInputElement | null;
                    if (colorInput) {
                      colorInput.value =
                        "default";
                    }

                    // Hide color picker and show "default" text
                    const colorPickerWrapper =
                      document.getElementById(
                        "themeColorPickerWrapper"
                      );
                    const defaultText =
                      document.getElementById(
                        "defaultColorText"
                      );
                    const colorPicker =
                      document.getElementById(
                        "themeColorPicker"
                      ) as HTMLInputElement | null;

                    if (
                      colorPickerWrapper &&
                      defaultText &&
                      colorPicker
                    ) {
                      colorPicker.style.display =
                        "none";
                      defaultText.style.display =
                        "block";
                    }
                  }

                  // Load skin with default color (don't apply custom colors)
                  loadWebixSkin(value);
                },
              },
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
                  <div class="theme-color-picker-wrapper" id="themeColorPickerWrapper">
                    <input id="themeColorPicker" type="color" value="#4b7bec" style="display: none;" />
                    <div id="defaultColorText" style="display: none; padding: 8px 12px; background: #f5f5f5; border-radius: 4px; color: #666; font-size: 13px;">
                      Default
                    </div>
                    <input type="hidden" id="primaryColorValue" value="default" />
                  </div>
                </div>
              `,
              on: {
                onAfterRender: function () {
                  const input =
                    document.getElementById(
                      "themeColorPicker"
                    ) as HTMLInputElement | null;
                  const defaultText =
                    document.getElementById(
                      "defaultColorText"
                    );
                  const colorPickerWrapper =
                    document.getElementById(
                      "themeColorPickerWrapper"
                    );

                  if (
                    input &&
                    defaultText &&
                    colorPickerWrapper
                  ) {
                    // Show color picker when clicked on default text
                    defaultText.addEventListener(
                      "click",
                      () => {
                        defaultText.style.display =
                          "none";
                        input.style.display =
                          "block";
                        input.click();
                      }
                    );

                    input.onchange = (e) => {
                      const target =
                        e.target as HTMLInputElement;
                      const color =
                        target.value || "#4b7bec";

                      // Update hidden field
                      const colorValue =
                        document.getElementById(
                          "primaryColorValue"
                        ) as HTMLInputElement | null;
                      if (colorValue) {
                        colorValue.value = color;
                      }

                      // Apply color to Webix components
                      const form = webix.$$(
                        "theme"
                      ) as any;
                      const skinValue =
                        form?.getValues()?.skin ||
                        "material";
                      applyPrimaryColorToWebix(
                        color,
                        skinValue
                      );
                    };

                    input.oninput = (e) => {
                      const target =
                        e.target as HTMLInputElement;
                      const color =
                        target.value || "#4b7bec";

                      // Update hidden field
                      const colorValue =
                        document.getElementById(
                          "primaryColorValue"
                        ) as HTMLInputElement | null;
                      if (colorValue) {
                        colorValue.value = color;
                      }

                      // Apply color to Webix components
                      const form = webix.$$(
                        "theme"
                      ) as any;
                      const skinValue =
                        form?.getValues()?.skin ||
                        "material";
                      applyPrimaryColorToWebix(
                        color,
                        skinValue
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
                    },
                  },
                },
              ],
            },
          ],
        },
      },
      getSaveButton(
        webix,
        "theme",
        "Theme settings saved",
        (values: any) => {
          // Get primary color from hidden field (could be "default" or a hex color)
          const colorValue =
            document.getElementById(
              "primaryColorValue"
            ) as HTMLInputElement | null;
          const primaryColor =
            colorValue?.value || "default";

          // Call backend API to update theme settings
          webix
            .ajax()
            .headers({
              "Content-Type": "application/json",
            })
            .put(
              `${API_BASE_URL}/users/1/theme/update/`,
              JSON.stringify({
                skin: values.skin,
                primary_color: primaryColor,
                font_family: values.font_family,
              })
            )
            .then((response: any) => {
              const data = response.json();
              console.log(
                "Theme settings updated:",
                data
              );
              // Refresh the page to apply theme changes globally
              window.location.reload();
            })
            .catch((err: any) => {
              console.error(
                "Failed to update theme settings",
                err
              );
            });
        }
      ),
    ],
    on: {
      onShow: function () {
        // Load theme settings from backend and populate the form
        webix
          .ajax()
          .get(`${API_BASE_URL}/users/1/theme/`)
          .then((response: any) => {
            const data = response.json();
            if (!data) return;

            const form = this as any;
            if (form && form.setValues) {
              // Get color picker value
              const colorPicker =
                document.getElementById(
                  "themeColorPicker"
                ) as HTMLInputElement | null;
              if (
                colorPicker &&
                data.primary_color
              ) {
                colorPicker.value =
                  data.primary_color;
              }

              form.setValues({
                skin: data.skin || "material",
                font_family:
                  data.font_family || "system",
              });

              // Load the skin CSS with primary color
              if (data.skin) {
                loadWebixSkin(
                  data.skin,
                  data.primary_color || "#4b7bec"
                );
              }

              // Apply font family
              if (data.font_family) {
                document.body.setAttribute(
                  "data-font",
                  data.font_family
                );
              }

              // Apply primary color to Webix components
              if (data.primary_color) {
                applyPrimaryColorToWebix(
                  data.primary_color
                );
              }
            }
          })
          .catch((err: any) => {
            console.error(
              "Failed to load theme settings",
              err
            );
          });
      },
    },
  };
}
