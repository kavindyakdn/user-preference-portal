import "./notifications.css";
import { API_BASE_URL } from "../../config";
import { getSaveButton } from "../../components/save-button";

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
          "<div style='padding: 20px; font-size: 18px; font-weight: bold;'>Notification Settings</div>",
        height: 50,
      },
      {
        view: "fieldset",
        label: "Push Notifications",
        body: {
          rows: [
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template:
                    "<div class='notification-tag'><div class='notification-tag-title'>Messages</div><div class='notification-tag-desc'>Messages from the people in your friend list</div></div>",
                },
                {
                  view: "switch",
                  name: "push_messages",
                  width: 80,
                },
              ],
            },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template:
                    "<div class='notification-tag'><div class='notification-tag-title'>Comments</div><div class='notification-tag-desc'>Comments on your posts and replies to your comments</div></div>",
                },
                {
                  view: "switch",
                  name: "push_comments",
                  width: 80,
                },
              ],
            },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template:
                    "<div class='notification-tag'><div class='notification-tag-title'>Reminders</div><div class='notification-tag-desc'>These are notifications to remind you of updates you might have missed</div></div>",
                },
                {
                  view: "switch",
                  name: "push_reminders",
                  width: 80,
                },
              ],
            },
          ],
        },
      },
      {
        view: "fieldset",
        label: "Email Notifications",
        body: {
          rows: [
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template:
                    "<div class='notification-tag'><div class='notification-tag-title'>News and Updates</div><div class='notification-tag-desc'>News about products and feature updates</div></div>",
                },
                {
                  view: "switch",
                  name: "email_news",
                  width: 80,
                },
              ],
            },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template:
                    "<div class='notification-tag'><div class='notification-tag-title'>Messages</div><div class='notification-tag-desc'>Messages from the people in your friend list</div></div>",
                },
                {
                  view: "switch",
                  name: "email_messages",
                  width: 80,
                },
              ],
            },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template:
                    "<div class='notification-tag'><div class='notification-tag-title'>Reminders</div><div class='notification-tag-desc'>These are notifications to remind you of updates you might have missed</div></div>",
                },
                {
                  view: "switch",
                  name: "email_reminders",
                  width: 80,
                },
              ],
            },
          ],
        },
      },
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
              `${API_BASE_URL}/users/1/notifications/update/`,
              JSON.stringify({
                push_messages:
                  !!values.push_messages,
                push_comments:
                  !!values.push_comments,
                push_reminders:
                  !!values.push_reminders,
                email_news: !!values.email_news,
                email_messages:
                  !!values.email_messages,
                email_reminders:
                  !!values.email_reminders,
              })
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
        console.log("khbajsndalksd,s");

        // Load notification settings from backend and populate the switches
        webix
          .ajax()
          .get(
            `${API_BASE_URL}/users/1/notifications/`
          )
          .then((response: any) => {
            const data = response.json();
            if (!data) return;

            const form = this as any;
            if (form && form.setValues) {
              form.setValues({
                push_messages: data.push_messages
                  ? 1
                  : 0,
                push_comments: data.push_comments
                  ? 1
                  : 0,
                push_reminders:
                  data.push_reminders ? 1 : 0,
                email_news: data.email_news
                  ? 1
                  : 0,
                email_messages:
                  data.email_messages ? 1 : 0,
                email_reminders:
                  data.email_reminders ? 1 : 0,
              });
            }
          })
          .catch((err: any) => {
            // Log but don't break the UI
            // eslint-disable-next-line no-console
            console.error(
              "Failed to load notification settings",
              err
            );
          });
      },
    },
  };
}
