import "./notifications.css";

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
                  template: "Messages",
                },
                {
                  view: "switch",
                  name: "push_messages",
                  value: 1,
                  width: 80,
                },
              ],
            },
            {
              view: "template",
              css: "notification-desc",
              borderless: true,
              // autoheight: true,
              template:
                "Messages from the people in your friend list",
            },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template: "Comments",
                },
                {
                  view: "switch",
                  name: "push_comments",
                  value: 1,
                  width: 80,
                },
              ],
            },
            {
              view: "template",
              css: "notification-desc",
              borderless: true,
              // autoheight: true,
              template:
                "Comments on your posts and replies to your comments",
            },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template: "Reminders",
                },
                {
                  view: "switch",
                  name: "push_reminders",
                  value: 1,
                  width: 80,
                },
              ],
            },
            {
              view: "template",
              css: "notification-desc",
              borderless: true,
              // autoheight: true,
              template:
                "These are notifications to remind you of updates you might have missed",
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
                  template: "News and Updates",
                },
                {
                  view: "switch",
                  name: "email_news",
                  value: 1,
                  width: 80,
                },
              ],
            },
            {
              view: "template",
              css: "notification-desc",
              borderless: true,
              // autoheight: true,
              template:
                "News about products and feature updates",
            },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template: "Messages",
                },
                {
                  view: "switch",
                  name: "email_messages",
                  value: 1,
                  width: 80,
                },
              ],
            },
            {
              view: "template",
              css: "notification-desc",
              borderless: true,
              // autoheight: true,
              template:
                "Messages from the people in your friend list",
            },
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template: "Reminders",
                },
                {
                  view: "switch",
                  name: "email_reminders",
                  value: 1,
                  width: 80,
                },
              ],
            },
            {
              view: "template",
              css: "notification-desc",
              borderless: true,
              // autoheight: true,
              template:
                "These are notifications to remind you of updates you might have missed",
            },
          ],
        },
      },
    ],
  };
}
