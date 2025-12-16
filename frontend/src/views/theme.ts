import "./theme.css";
import "../style.css";
import { API_BASE_URL } from "../config";
import { getSaveButton } from "../components/save-button";

const USER_ID = 1;
const DEFAULT_PRIMARY_COLOR = "default";
const DEFAULT_COLOR_VALUE = "#4b7bec";

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
      applyPrimaryColorToWebix(primaryColor);
    }
  };

  document.head.appendChild(link);

  // If color is provided and link loads immediately, apply it (only if not "default")
  if (
    primaryColor &&
    primaryColor !== "default" &&
    link.sheet
  ) {
    applyPrimaryColorToWebix(primaryColor);
  }
}

// Function to apply primary color to Webix components
export function applyPrimaryColorToWebix(
  primaryColor: string
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
      background-color: ${primaryColor} !important;
      border-color: ${primaryColor} !important;
    }
    
    .webix_button:hover,
    .webix_el_button button:hover {
      background-color: ${primaryColor} !important;
      opacity: 0.9;
    }
    
    .webix_selected,
    .webix_list_item.webix_selected,
    .webix_menu_item.webix_selected {
      background-color: ${primaryColor} !important;
    }
    
    .webix_menu_item.webix_selected .webix_icon {
      color: ${primaryColor} !important;
    }
    
    .webix_segment_0.webix_selected,
    .webix_segment_1.webix_selected {
      background-color: ${primaryColor} !important;
      border-color: ${primaryColor} !important;
    }
    
    .webix_radio_icon.webix_radio_checked {
      background-color: ${primaryColor} !important;
      border-color: ${primaryColor} !important;
    }
    
    .webix_switch_on {
      background-color: ${primaryColor} !important;
    }
    
    .webix_header .webix_header_content {
      background-color: ${primaryColor} !important;
    }
    
    .webix_toolbar .webix_img_btn:hover {
      background-color: ${primaryColor} !important;
    }
    
    /* Apply to CSS variable as well */
    :root {
      --app-primary-color: ${primaryColor};
    }
  `;
  document.head.appendChild(style);
}

// Function to apply font family to Webix components
export function applyFontFamilyToWebix(
  fontFamily: string
) {
  // If fontFamily is "default", remove any custom font overrides
  // and let the skin's native CSS handle the font
  if (fontFamily === "default") {
    // Remove custom font styles to use skin defaults
    const existingStyle = document.getElementById(
      "webix-custom-font"
    ) as HTMLStyleElement | null;
    if (existingStyle) {
      existingStyle.remove();
    }
    // Also remove data-font attribute
    document.body.removeAttribute("data-font");
    return;
  }

  // Map font family values to CSS font-family strings
  const fontFamilyMap: Record<string, string> = {
    system:
      "system-ui, Avenir, Helvetica, Arial, sans-serif",
    sans: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    serif: '"Georgia", "Times New Roman", serif',
    mono: '"SF Mono", "Consolas", "Menlo", monospace',
  };

  const fontToApply =
    fontFamilyMap[fontFamily] ||
    fontFamilyMap.system;

  // Remove existing custom font style if any
  const existingStyle = document.getElementById(
    "webix-custom-font"
  ) as HTMLStyleElement | null;
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create style element with custom font overrides
  const style = document.createElement("style");
  style.id = "webix-custom-font";
  style.textContent = `
    /* Override Webix font family with custom font */
    body,
    .webix_view,
    .webix_el_text input,
    .webix_el_textarea textarea,
    .webix_el_label,
    .webix_el_button button,
    .webix_list_item,
    .webix_menu_item,
    .webix_header,
    .webix_toolbar,
    .webix_template {
      font-family: ${fontToApply} !important;
    }
  `;
  document.head.appendChild(style);

  // Also set data-font attribute for consistency
  document.body.setAttribute(
    "data-font",
    fontFamily
  );
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
          <div class="category-title">Theme Settings</div>
          <div class="theme-subtitle">
            Personalize how your preferences portal looks and feels.
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
              customRadio: true,
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
                  // When skin changes, reset primary color to "default"
                  const form = webix.$$(
                    "theme"
                  ) as any;
                  if (form) {
                    form.setValues(
                      {
                        primary_color:
                          DEFAULT_PRIMARY_COLOR,
                        font_family: "default",
                      },
                      true
                    );
                  }
                  const picker = webix.$$(
                    "primaryColorPicker"
                  ) as any;
                  if (picker) {
                    picker.setValue(
                      DEFAULT_COLOR_VALUE
                    );
                  }
                  applyPrimaryColorToWebix(
                    DEFAULT_PRIMARY_COLOR
                  );
                  applyFontFamilyToWebix(
                    "default"
                  );

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
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template: `
                    <div class='theme-color-text'>
                      <div class='label-text'>Primary color</div>
                      <div class='label-description'>
                        This accent color is used for highlights and primary actions.
                      </div>
                    </div>
                  `,
                },
                {
                  rows: [
                    {
                      view: "colorpicker",
                      id: "primaryColorPicker",
                      name: "primary_color_picker",
                      stringResult: true,
                      value: DEFAULT_COLOR_VALUE,
                      on: {
                        onChange: function (
                          value: string
                        ) {
                          const form =
                            (
                              this as any
                            ).getFormView?.() ||
                            webix.$$("theme");
                          if (form) {
                            form.setValues(
                              {
                                primary_color:
                                  value,
                              },
                              true
                            );
                          }
                          applyPrimaryColorToWebix(
                            value
                          );
                        },
                      },
                    },
                    {
                      view: "button",
                      value: "Use default",
                      css: "webix_secondary",
                      click: function () {
                        const form =
                          (
                            this as any
                          ).getFormView?.() ||
                          webix.$$("theme");
                        if (form) {
                          form.setValues(
                            {
                              primary_color:
                                DEFAULT_PRIMARY_COLOR,
                            },
                            true
                          );
                        }
                        const picker = webix.$$(
                          "primaryColorPicker"
                        ) as any;
                        if (picker) {
                          picker.setValue(
                            DEFAULT_COLOR_VALUE
                          );
                        }
                        applyPrimaryColorToWebix(
                          DEFAULT_PRIMARY_COLOR
                        );
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        view: "text",
        name: "primary_color",
        hidden: true,
        value: DEFAULT_PRIMARY_COLOR,
      },
      {
        view: "fieldset",
        label: "Font",
        body: {
          rows: [
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template: `<div class='label-text'>Font Family</div>
                                    <div class='label-description'>This font family will be used across the entire application</div>  `,
                },
                {
                  view: "richselect",
                  name: "font_family",
                  value: "default",
                  options: [
                    {
                      id: "default",
                      value: "Default",
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
                      // Apply font family to Webix components
                      applyFontFamilyToWebix(
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
          // Get primary color from form state (could be "default" or a hex color)
          const primaryColor =
            values.primary_color ||
            values.primary_color_picker ||
            DEFAULT_PRIMARY_COLOR;

          // Call backend API to update theme settings
          webix
            .ajax()
            .headers({
              "Content-Type": "application/json",
            })
            .put(
              `${API_BASE_URL}/users/${USER_ID}/theme/update/`,
              JSON.stringify({
                skin: values.skin,
                primary_color: primaryColor,
                font_family: values.font_family,
              })
            )
            .then((response: any) => {
              const data = response.json();
              const savedPrimaryColor =
                data.primary_color ||
                DEFAULT_PRIMARY_COLOR;
              const savedSkin =
                data.skin || "material";
              loadWebixSkin(
                savedSkin,
                savedPrimaryColor !==
                  DEFAULT_PRIMARY_COLOR
                  ? savedPrimaryColor
                  : undefined
              );
              applyPrimaryColorToWebix(
                savedPrimaryColor
              );
              applyFontFamilyToWebix(
                data.font_family || "default"
              );
              console.log(
                "Theme settings updated:",
                data
              );
              webix.message(
                "Theme settings updated"
              );
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
          .get(
            `${API_BASE_URL}/users/${USER_ID}/theme/`
          )
          .then((response: any) => {
            const data = response.json();
            if (!data) return;

            const form = this as any;
            if (form && form.setValues) {
              const primaryColor =
                data.primary_color ||
                DEFAULT_PRIMARY_COLOR;

              form.setValues(
                {
                  skin: data.skin || "material",
                  font_family:
                    data.font_family || "default",
                  primary_color: primaryColor,
                },
                true
              );

              const picker = webix.$$(
                "primaryColorPicker"
              ) as any;
              if (picker) {
                picker.setValue(
                  primaryColor ===
                    DEFAULT_PRIMARY_COLOR
                    ? DEFAULT_COLOR_VALUE
                    : primaryColor
                );
              }

              // Load the skin CSS with primary color (skip custom if default)
              if (data.skin) {
                loadWebixSkin(
                  data.skin,
                  primaryColor !==
                    DEFAULT_PRIMARY_COLOR
                    ? primaryColor
                    : undefined
                );
              } else {
                loadWebixSkin("material");
              }

              // Apply font family and primary color to Webix components
              applyFontFamilyToWebix(
                data.font_family || "default"
              );
              applyPrimaryColorToWebix(
                primaryColor
              );
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
