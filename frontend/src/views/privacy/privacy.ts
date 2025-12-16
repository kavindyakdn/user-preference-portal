import "./privacy.css";
import { API_BASE_URL } from "../../config";
import { getSaveButton } from "../../components/save-button";

const USER_ID = 1;

// Helper function to convert boolean to Webix switch value (1 or 0)
function boolToSwitch(
  value: boolean | undefined
): number {
  return value ? 1 : 0;
}

// Helper function to convert Webix switch value to boolean
function switchToBool(
  value: number | undefined
): boolean {
  return !!value;
}

// Helper function to create a switch row with label and description
function createSwitchRow(
  label: string,
  description: string,
  name: string
) {
  return {
    cols: [
      {
        view: "template",
        borderless: true,
        autoheight: true,
        template: `
          <div class='label-text'>${label}</div>
          <div class='label-description'>${description}</div>
        `,
      },
      {
        view: "switch",
        name: name,
        width: 80,
      },
    ],
  };
}

// Privacy settings configuration
const PRIVACY_SETTINGS = {
  profileVisibility: {
    fieldsetLabel: "Profile Visibility",
    radioName: "profile_visibility",
    radioOptions: [
      { id: "public", value: "Public" },
      { id: "friends", value: "Friends only" },
      { id: "private", value: "Only me" },
    ],
    description:
      "Control who can view your profile information across the platform.",
  },
  switches: [
    {
      fieldsetLabel: "Contact Information",
      label: "Show my email to others",
      description:
        "Allow other users to see your email address on your profile",
      name: "show_email",
    },
    {
      fieldsetLabel: "Data Sharing",
      label:
        "Share usage data to improve the service",
      description:
        "Allow us to use anonymized data to improve features and performance.",
      name: "data_sharing",
    },
  ],
};

export function getPrivacyView(webix: any) {
  return {
    view: "form",
    id: "privacy",
    scroll: true,
    width: 0,
    elements: [
      {
        view: "template",
        template: `
          <div class="category-title">Privacy Settings</div>
          <div class="category-subtitle">
            Manage privacy preferences, including profile visibility and data sharing.
          </div>
        `,
        height: 80,
        borderless: true,
      },
      {
        view: "fieldset",
        label:
          PRIVACY_SETTINGS.profileVisibility
            .fieldsetLabel,
        body: {
          rows: [
            {
              view: "radio",
              name: PRIVACY_SETTINGS
                .profileVisibility.radioName,
              value: "public",
              options:
                PRIVACY_SETTINGS.profileVisibility
                  .radioOptions,
            },
            {
              view: "template",
              css: "privacy-desc",
              borderless: true,
              autoheight: true,
              template:
                PRIVACY_SETTINGS.profileVisibility
                  .description,
            },
          ],
        },
      },
      ...PRIVACY_SETTINGS.switches.map(
        (switchSetting) => ({
          view: "fieldset",
          label: switchSetting.fieldsetLabel,
          body: {
            cols: [
              createSwitchRow(
                switchSetting.label,
                switchSetting.description,
                switchSetting.name
              ),
            ],
          },
        })
      ),
      getSaveButton(
        webix,
        "privacy",
        "Privacy settings saved",
        (values: any) => {
          // Call backend API to update privacy settings
          webix
            .ajax()
            .headers({
              "Content-Type": "application/json",
            })
            .put(
              `${API_BASE_URL}/users/${USER_ID}/privacy/update/`,
              JSON.stringify({
                profile_visibility:
                  values.profile_visibility,
                ...PRIVACY_SETTINGS.switches.reduce(
                  (acc, switchSetting) => {
                    acc[switchSetting.name] =
                      switchToBool(
                        values[switchSetting.name]
                      );
                    return acc;
                  },
                  {} as Record<string, boolean>
                ),
              })
            )
            .then((response: any) => {
              const data = response.json();
              console.log(
                "Privacy settings updated:",
                data
              );
              webix.message(
                "Privacy settings saved"
              );
            })
            .catch((err: any) => {
              console.error(
                "Failed to update privacy settings",
                err
              );
              webix.message(
                "Failed to update privacy settings",
                "error"
              );
            });
        }
      ),
    ],
    on: {
      onShow: function () {
        // Load privacy settings from backend and populate the form
        webix
          .ajax()
          .get(
            `${API_BASE_URL}/users/${USER_ID}/privacy/`
          )
          .then((response: any) => {
            const data = response.json();
            if (!data) return;

            const form = this as any;
            if (form && form.setValues) {
              const formValues: Record<
                string,
                any
              > = {
                profile_visibility:
                  data.profile_visibility ||
                  "public",
              };

              PRIVACY_SETTINGS.switches.forEach(
                (switchSetting) => {
                  formValues[switchSetting.name] =
                    boolToSwitch(
                      data[switchSetting.name]
                    );
                }
              );

              form.setValues(formValues);
            }
          })
          .catch((err: any) => {
            console.error(
              "Failed to load privacy settings",
              err
            );
          });
      },
    },
  };
}
