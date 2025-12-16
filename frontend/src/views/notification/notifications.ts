import "./notifications.css";
import "../../style.css";
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
          "<div class='category-title'>Notification Settings</div>",
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
                  template: `
                    <div class='label-text'>Messages</div>
                    <div class='label-description'>Messages from the people in your friend list</div>`,
                },
                {
                  view: "switch",
                  name: "push_messages",
                  width: 80,
                },
              ],
            },
            // {
            //   view: "template",
            //   css: "notification-desc",
            //   borderless: true,
            //   // autoheight: true,
            //   template:
            //     "<div class='label-description'>Messages from the people in your friend list</div>",
            // },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template: `<div class='label-text'>Comments</div>
                                    <div class='label-description'>Comments on your posts and replies to your comments</div>`,
                },
                {
                  view: "switch",
                  name: "push_comments",
                  width: 80,
                },
              ],
            },
            // {
            //   view: "template",
            //   css: "notification-desc",
            //   borderless: true,
            //   // autoheight: true,
            //   template:
            //     "<div class='label-description'>Comments on your posts and replies to your comments</div>",
            // },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template: `<div class='label-text'>Reminders</div>
                    <div class='label-description'>These are notifications to remind you of updates you might have missed</div>`,
                },
                {
                  view: "switch",
                  name: "push_reminders",
                  width: 80,
                },
              ],
            },
            // {
            //   view: "template",
            //   css: "notification-desc",
            //   borderless: true,
            //   // autoheight: true,
            //   template:
            //     "<div class='label-description'>These are notifications to remind you of updates you might have missed</div>",
            // },
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
                  template: `<div class='label-text'>News and Updates</div>
                                    <div class='label-description'>News about products and feature updates</div>
`,
                },
                {
                  view: "switch",
                  name: "email_news",
                  width: 80,
                },
              ],
            },
            // {
            //   view: "template",
            //   css: "notification-desc",
            //   borderless: true,
            //   // autoheight: true,
            //   template:
            //     "<div class='label-description'>News about products and feature updates</div>",
            // },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template: `<div class='label-text'>Messages</div>
                                    <div class='label-description'>Messages from the people in your friend list</div>  `,
                },
                {
                  view: "switch",
                  name: "email_messages",
                  width: 80,
                },
              ],
            },
            // {
            //   view: "template",
            //   css: "notification-desc",
            //   borderless: true,
            //   // autoheight: true,
            //   template:
            //     "<div class='label-description'>Messages from the people in your friend list</div>",
            // },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template: `<div class='label-text'>Reminders</div>
                    <div class='label-description'>These are notifications to remind you of updates you might have missed</div>`,
                },
                {
                  view: "switch",
                  name: "email_reminders",
                  width: 80,
                },
              ],
            },
            // {
            //   view: "template",
            //   css: "notification-desc",
            //   borderless: true,
            //   // autoheight: true,
            //   template:
            //     "<div class='label-description'>These are notifications to remind you of updates you might have missed</div>",
            // },
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
