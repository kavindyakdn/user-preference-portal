import "./account.css";
import { API_BASE_URL } from "../../config";
import { getSaveButton } from "../../components/save-button";

const USER_ID = 1;
const DEFAULT_ERROR =
  "Failed to process your request. Please try again.";

// Helper function to construct full URL for profile picture
export function getProfilePictureUrl(
  relativeUrl: string | null
): string {
  if (!relativeUrl) return "";
  if (relativeUrl.startsWith("http"))
    return relativeUrl;
  const baseUrl = API_BASE_URL.replace(
    "/api",
    ""
  );
  return `${baseUrl}${relativeUrl}`;
}

// Helper function to update profile picture in template using Webix data binding
export function updateProfilePicture(
  webix: any,
  imageUrl: string | null
) {
  const template = webix.$$(
    "profilePhotoTemplate"
  );
  if (template) {
    const fullUrl =
      getProfilePictureUrl(imageUrl);
    template.setValues({
      profilePictureUrl: fullUrl,
    });
  }
}

export function extractErrorMessage(
  err: any,
  fallback: string
) {
  try {
    const text =
      err?.responseText ||
      err?.response ||
      err?.statusText;
    if (text) {
      try {
        const parsed = JSON.parse(text);
        return (
          parsed?.error?.message ||
          parsed?.message ||
          fallback
        );
      } catch {
        return text;
      }
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

export function getAccountView(webix: any) {
  return {
    view: "form",
    id: "account",
    scroll: true,
    width: 0,
    elements: [
      {
        view: "template",
        template:
          "<div class='category-title'>Account Settings</div>",
        height: 50,
      },
      {
        rows: [
          {
            view: "template",
            id: "profilePhotoTemplate",
            template: function (obj: any) {
              const imageUrl =
                obj.profilePictureUrl || "";
              const hasImage =
                imageUrl && imageUrl.length > 0;
              return `
                <div class="profile-photo-container">
                  <div class="profile-photo-wrapper">
                    <div class="profile-photo">
                      ${
                        hasImage
                          ? `<img src="${imageUrl}" alt="Profile photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`
                          : `<div class="profile-photo-add-button" aria-label="Add profile photo" role="button"><span>+</span></div>`
                      }
                    </div>
                  </div>
                </div>
              `;
            },
            height: 180,
            borderless: true,
            data: {
              profilePictureUrl: "",
            },
          },
          {
            view: "uploader",
            id: "profilePhotoUploader",
            value: "Upload photo",
            accept: "image/*",
            autosend: true,
            multiple: false,
            upload: `${API_BASE_URL}/users/${USER_ID}/profile-picture/`,
            link: "profilePhotoTemplate",
            on: {
              onAfterFileAdd: function (
                file: any
              ) {
                // Show preview immediately using FileReader
                if (file && file.file) {
                  const reader = new FileReader();
                  reader.onload = function (
                    event: ProgressEvent<FileReader>
                  ) {
                    if (
                      event.target &&
                      event.target.result
                    ) {
                      updateProfilePicture(
                        webix,
                        event.target
                          .result as string
                      );
                    }
                  };
                  reader.readAsDataURL(
                    file.file as File
                  );
                }
              },
              onFileUpload: function (
                response: any
              ) {
                webix.message(
                  "Profile photo updated"
                );
                const data = response.json();
                if (
                  data &&
                  data.profile_picture
                ) {
                  updateProfilePicture(
                    webix,
                    data.profile_picture
                  );
                }
              },
              onFileUploadError: function (
                error: any
              ) {
                console.error(
                  "Failed to upload profile photo",
                  error
                );
                webix.message(
                  "Failed to upload profile photo",
                  "error"
                );
              },
            },
          },
        ],
      },
      {
        view: "text",
        label: "Email",
        name: "email",
        placeholder: "Enter email",
        labelWidth: 120,
        invalidMessage:
          "Enter a valid email address",
      },
      {
        view: "text",
        label: "First Name",
        name: "firstName",
        placeholder: "Enter first name",
        labelWidth: 120,
      },
      {
        view: "text",
        label: "Last Name",
        name: "lastName",
        placeholder: "Enter last name",
        labelWidth: 120,
      },
      {
        cols: [
          {
            view: "template",
            borderless: true,
            autoheight: true,
            template: `<div class='label-text'>Password</div>`,
          },
          {
            view: "button",
            value: "Edit password",
            width: 140,
            css: "webix_secondary",
            click: function () {
              const section = webix.$$(
                "passwordSection"
              );
              if (section) {
                if (section.isVisible()) {
                  section.hide();
                  section.clear?.();
                } else {
                  section.show();
                }
              }
            },
          },
        ],
      },
      {
        id: "passwordSection",
        hidden: true,
        rows: [
          {
            view: "text",
            type: "password",
            label: "Current Password",
            name: "current_password",
            placeholder: "Enter current password",
            labelWidth: 120,
          },
          {
            view: "text",
            type: "password",
            label: "New Password",
            name: "new_password",
            placeholder: "Enter new password",
            labelWidth: 120,
          },
          {
            view: "text",
            type: "password",
            label: "Confirm Password",
            name: "confirm_password",
            placeholder: "Confirm new password",
            labelWidth: 120,
          },
        ],
      },
      getSaveButton(
        webix,
        "account",
        "Account settings saved",
        (values: any) => {
          const hasPasswordChange =
            !!values.current_password ||
            !!values.new_password ||
            !!values.confirm_password;

          if (hasPasswordChange) {
            if (
              !values.current_password ||
              !values.new_password ||
              !values.confirm_password
            ) {
              webix.message(
                "Please fill all password fields",
                "error"
              );
              return;
            }
            if (
              values.new_password !==
              values.confirm_password
            ) {
              webix.message(
                "New password and confirmation do not match",
                "error"
              );
              return;
            }
          }

          const updateUser = () =>
            webix
              .ajax()
              .headers({
                "Content-Type":
                  "application/json",
              })
              .put(
                `${API_BASE_URL}/users/${USER_ID}/update/`,
                JSON.stringify({
                  email: values.email,
                  first_name: values.firstName,
                  last_name: values.lastName,
                })
              )
              .then((response: any) => {
                const data = response.json();
                console.log(
                  "User updated:",
                  data
                );
                webix.message(
                  "Account settings saved"
                );
              });

          const updatePassword = () =>
            webix
              .ajax()
              .headers({
                "Content-Type":
                  "application/json",
              })
              .put(
                `${API_BASE_URL}/users/${USER_ID}/password/update/`,
                JSON.stringify({
                  current_password:
                    values.current_password,
                  new_password:
                    values.new_password,
                  confirm_password:
                    values.confirm_password,
                })
              )
              .then(() => {
                webix.message("Password updated");
                const form = webix.$$(
                  "account"
                ) as any;
                if (form?.setValues) {
                  form.setValues(
                    {
                      current_password: "",
                      new_password: "",
                      confirm_password: "",
                    },
                    true
                  );
                }
                const section = webix.$$(
                  "passwordSection"
                );
                section?.hide();
              });

          updateUser()
            .then(() => {
              if (hasPasswordChange) {
                return updatePassword();
              }
            })
            .catch((err: any) => {
              console.error(
                "Failed to update user or password",
                err
              );
              webix.message(
                extractErrorMessage(
                  err,
                  DEFAULT_ERROR
                ),
                "error"
              );
            });
        }
      ),
    ],
    rules: {
      email: function (value: string) {
        return (
          webix.rules.isNotEmpty(value) &&
          webix.rules.isEmail(value)
        );
      },
      firstName: webix.rules.isNotEmpty,
      lastName: webix.rules.isNotEmpty,
    },
    on: {
      onShow: function () {
        // Load user data from backend API and populate the form
        webix
          .ajax()
          .get(
            `${API_BASE_URL}/users/${USER_ID}/`
          )
          .then((response: any) => {
            const data = response.json();
            if (!data) return;

            const form = this as any;
            if (form && form.setValues) {
              form.setValues({
                email: data.email,
                firstName: data.first_name,
                lastName: data.last_name,
              });
            }

            // Load profile picture using Webix data binding
            updateProfilePicture(
              webix,
              data.profile_picture
            );
          })
          .catch((err: any) => {
            console.error(
              "Failed to load user data",
              err
            );
          });
      },
    },
  };
}
