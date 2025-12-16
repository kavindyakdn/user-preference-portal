import "./privacy.css";
import { API_BASE_URL } from "../../config";
import { getSaveButton } from "../../components/save-button";

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
          <div class="privacy-header">
            <div class="privacy-title">Privacy Settings</div>
            <div class="privacy-subtitle">
              Manage privacy preferences, including profile visibility and data sharing.
            </div>
          </div>
        `,
        height: 80,
        borderless: true,
      },
      {
        view: "fieldset",
        label: "Profile visibility",
        body: {
          rows: [
            {
              view: "radio",
              name: "profile_visibility",
              value: "public",
              options: [
                { id: "public", value: "Public" },
                { id: "friends", value: "Friends only" },
                { id: "private", value: "Only me" },
              ],
              vertical: true,
            },
          ],
        },
      },
      {
        view: "fieldset",
        label: "Profile details",
        body: {
          rows: [
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template:
                    "<div class='privacy-tag'><div class='privacy-tag-title'>Show email on profile</div><div class='privacy-tag-desc'>Allow others to see your email address on your profile.</div></div>",
                },
                {
                  view: "switch",
                  name: "show_email",
                  width: 80,
                },
              ],
            },
          ],
        },
      },
      {
        view: "fieldset",
        label: "Data sharing",
        body: {
          rows: [
            {
              cols: [
                {
                  view: "template",
                  borderless: true,
                  autoheight: true,
                  template:
                    "<div class='privacy-tag'><div class='privacy-tag-title'>Allow data sharing</div><div class='privacy-tag-desc'>Share usage data to improve the product experience.</div></div>",
                },
                {
                  view: "switch",
                  name: "data_sharing",
                  width: 80,
                },
              ],
            },
          ],
        },
      },
      getSaveButton(
        webix,
        "privacy",
        "Privacy settings saved",
        (values: any) => {
          webix
            .ajax()
            .headers({
              "Content-Type": "application/json",
            })
            .put(
              `${API_BASE_URL}/users/1/privacy/update/`,
              JSON.stringify({
                profile_visibility: values.profile_visibility,
                show_email: !!values.show_email,
                data_sharing: !!values.data_sharing,
              })
            )
            .then((response: any) => {
              const data = response.json();
              console.log(
                "Privacy settings updated:",
                data
              );
            })
            .catch((err: any) => {
              console.error(
                "Failed to update privacy settings",
                err
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
          .get(`${API_BASE_URL}/users/1/privacy/`)
          .then((response: any) => {
            const data = response.json();
            if (!data) return;

            const form = this as any;
            if (form && form.setValues) {
              form.setValues({
                profile_visibility:
                  data.profile_visibility || "public",
                show_email: data.show_email ? 1 : 0,
                data_sharing: data.data_sharing ? 1 : 0,
              });
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
