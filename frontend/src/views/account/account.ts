import "./account.css";
import { getSaveButton } from "../../components/save-button";

export function getAccountView(webix: any) {
  return {
    view: "form",
    id: "accountForm",
    scroll: true,
    width: 0,

    elements: [
      {
        view: "template",
        template:
          "<div style='padding: 20px; font-size: 18px; font-weight: bold;'>Account Settings</div>",
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
          },
        },
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
        "accountForm",
        "Account settings saved"
      ),
    ],
    rules: {
      firstName: webix.rules.isNotEmpty,
      lastName: webix.rules.isNotEmpty,
    },
  };
}
