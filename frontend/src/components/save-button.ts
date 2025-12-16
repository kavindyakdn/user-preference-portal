export function getSaveButton(
  webix: any,
  formId: string,
  successMessage: string = "Settings saved",
  onSave?: (values: any) => void
) {
  return {
    view: "button",
    value: "Save Changes",
    type: "form",
    click: function () {
      const form = webix.$$(formId);
      if (form) {
        const values = form.getValues();
        webix.message(successMessage);
        console.log("Form data:", values);

        if (onSave) {
          onSave(values);
        }
      }
    },
  };
}
