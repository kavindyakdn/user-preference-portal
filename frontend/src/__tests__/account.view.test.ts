import {
  updateProfilePicture,
  extractErrorMessage,
} from "../views/account/account";

// Mock API_BASE_URL replacement behavior
jest.mock("../config", () => ({
  API_BASE_URL: "http://localhost:8000/api",
}));

describe("account view helpers (broader)", () => {
  it("updateProfilePicture sets full URL on template via webix $$", () => {
    const setValues = jest.fn();
    const webix = {
      $$: jest
        .fn()
        .mockReturnValue({ setValues }),
    };

    updateProfilePicture(
      webix as any,
      "/media/profile.png"
    );

    expect(webix.$$).toHaveBeenCalledWith(
      "profilePhotoTemplate"
    );
    expect(setValues).toHaveBeenCalledWith({
      profilePictureUrl:
        "http://localhost:8000/media/profile.png",
    });
  });

  it("extractErrorMessage falls back to statusText", () => {
    const err = { statusText: "Server broke" };
    const fallback = "fallback";
    expect(
      extractErrorMessage(err, fallback)
    ).toBe("Server broke");
  });
});
