import "../../style.css";
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

// Helper function to create a notification row
function createNotificationRow(
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

// Notification settings configuration
const NOTIFICATION_SETTINGS = [
  {
    category: "Push Notifications",
    settings: [
      {
        label: "Messages",
        description:
          "Messages from the people in your friend list",
        name: "push_messages",
      },
      {
        label: "Comments",
        description:
          "Comments on your posts and replies to your comments",
        name: "push_comments",
      },
      {
        label: "Reminders",
        description:
          "These are notifications to remind you of updates you might have missed",
        name: "push_reminders",
      },
    ],
  },
  {
    category: "Email Notifications",
    settings: [
      {
        label: "News and Updates",
        description:
          "News about products and feature updates",
        name: "email_news",
      },
      {
        label: "Messages",
        description:
          "Messages from the people in your friend list",
        name: "email_messages",
      },
      {
        label: "Reminders",
        description:
          "These are notifications to remind you of updates you might have missed",
        name: "email_reminders",
      },
    ],
  },
];

export function getNotificationsView(webix: any) {
  return {
    view: "form",
    id: "notificationsForm",
    scroll: true,
    width: 0,
    elements: [
      {
        view: "template",
        template:
          "<div class='category-title'>Notification Settings</div>",
        height: 50,
      },
      ...NOTIFICATION_SETTINGS.map(
        (category) => ({
          view: "fieldset",
          label: category.category,
          body: {
            rows: category.settings.map(
              (setting) =>
                createNotificationRow(
                  setting.label,
                  setting.description,
                  setting.name
                )
            ),
          },
        })
      ),
      getSaveButton(
        webix,
        "notifications",
        "Notification settings saved",
        (values: any) => {
          // Call backend API to update notification settings
          webix
            .ajax()
            .headers({
              "Content-Type": "application/json",
            })
            .put(
              `${API_BASE_URL}/users/${USER_ID}/notifications/update/`,
              JSON.stringify(
                NOTIFICATION_SETTINGS.reduce(
                  (acc, category) => {
                    category.settings.forEach(
                      (setting) => {
                        acc[setting.name] =
                          switchToBool(
                            values[setting.name]
                          );
                      }
                    );
                    return acc;
                  },
                  {} as Record<string, boolean>
                )
              )
            )
            .then((response: any) => {
              const data = response.json();
              console.log(
                "Notification settings updated:",
                data
              );
            })
            .catch((err: any) => {
              console.error(
                "Failed to update notification settings",
                err
              );
            });
        }
      ),
    ],
    on: {
      onShow: function () {
        // Load notification settings from backend and populate the switches
        webix
          .ajax()
          .get(
            `${API_BASE_URL}/users/${USER_ID}/notifications/`
          )
          .then((response: any) => {
            const data = response.json();
            if (!data) return;

            const form = this as any;
            if (form && form.setValues) {
              const formValues =
                NOTIFICATION_SETTINGS.reduce(
                  (acc, category) => {
                    category.settings.forEach(
                      (setting) => {
                        acc[setting.name] =
                          boolToSwitch(
                            data[setting.name]
                          );
                      }
                    );
                    return acc;
                  },
                  {} as Record<string, number>
                );
              form.setValues(formValues);
            }
          })
          .catch((err: any) => {
            console.error(
              "Failed to load notification settings",
              err
            );
          });
      },
    },
  };
}
