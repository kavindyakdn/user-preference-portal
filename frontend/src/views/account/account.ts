import "./account.css";
import { API_BASE_URL } from "../../config";
import { getSaveButton } from "../../components/save-button";

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
        view: "template",
        template: `
          <div class="profile-photo-container">
            <div class="profile-photo-wrapper">
              <div id="profilePhoto" class="profile-photo">
                <div class="profile-photo-add-button">
                  <span>+</span>
                </div>
              </div>
              <input type="file" id="photoInput" accept="image/*" class="photo-input" />
            </div>
          </div>
        `,
        height: 180,
        on: {
          onAfterRender: function () {
            console.log(
              "profile photo template rendered"
            );

            // Wire up profile photo click / upload
            const photoDiv =
              document.getElementById(
                "profilePhoto"
              );
            const photoInput =
              document.getElementById(
                "photoInput"
              ) as HTMLInputElement;

            if (photoDiv && photoInput) {
              photoDiv.addEventListener(
                "click",
                () => {
                  photoInput.click();
                }
              );

              photoInput.addEventListener(
                "change",
                (e: Event) => {
                  const target =
                    e.target as HTMLInputElement;
                  if (
                    target.files &&
                    target.files[0]
                  ) {
                    const reader =
                      new FileReader();
                    reader.onload = function (
                      event: ProgressEvent<FileReader>
                    ) {
                      if (
                        event.target &&
                        event.target.result
                      ) {
                        const img =
                          document.createElement(
                            "img"
                          );
                        img.src = event.target
                          .result as string;

                        const existingImg =
                          photoDiv.querySelector(
                            "img"
                          );
                        if (existingImg) {
                          photoDiv.removeChild(
                            existingImg
                          );
                        }
                        photoDiv.insertBefore(
                          img,
                          photoDiv.firstChild
                        );

                        webix.message(
                          "Profile photo updated"
                        );
                      }
                    };
                    reader.readAsDataURL(
                      target.files[0]
                    );
                  }
                }
              );
            }

            // Fetch user data from backend API and populate the form
            console.log(
              "loading user data from API..."
            );
            webix
              .ajax()
              .get(`${API_BASE_URL}/users/1/`)
              .then((response: any) => {
                const data = response.json();
                console.log(
                  "user data response",
                  data
                );
                if (data) {
                  const form = webix.$$(
                    "account"
                  ) as any;
                  if (form && form.setValues) {
                    form.setValues({
                      email: data.email,
                      firstName: data.first_name,
                      lastName: data.last_name,
                    });
                  }
                }
              })
              .catch((err: any) => {
                console.error(
                  "Failed to load user data",
                  err
                );
              });
          },
        },
      },
      {
        view: "text",
        label: "Email",
        name: "email",
        placeholder: "Enter email",
        labelWidth: 120,
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
      getSaveButton(
        webix,
        "account",
        "Account settings saved",
        (values: any) => {
          // Call backend API to update user
          webix
            .ajax()
            .headers({
              "Content-Type": "application/json",
            })
            .put(
              `${API_BASE_URL}/users/1/update/`,
              JSON.stringify({
                email: values.email,
                first_name: values.firstName,
                last_name: values.lastName,
              })
            )
            .then((response: any) => {
              const data = response.json();
              console.log("User updated:", data);
            })
            .catch((err: any) => {
              console.error(
                "Failed to update user",
                err
              );
            });
        }
      ),
    ],
    rules: {
      email: webix.rules.isNotEmpty,
      firstName: webix.rules.isNotEmpty,
      lastName: webix.rules.isNotEmpty,
    },
  };
}
