import {
  getProfilePictureUrl,
  extractErrorMessage,
} from "../views/account/account";

// Mock API_BASE_URL replacement behavior
jest.mock("../config", () => ({
  API_BASE_URL: "http://localhost:8000/api",
}));

describe("getProfilePictureUrl", () => {
  it("returns empty string for null/empty", () => {
    expect(getProfilePictureUrl(null)).toBe("");
    expect(getProfilePictureUrl("")).toBe("");
  });

  it("returns absolute url unchanged", () => {
    const abs = "https://example.com/img.png";
    expect(getProfilePictureUrl(abs)).toBe(abs);
  });

  it("prefixes relative url with API base (sans /api)", () => {
    const relative = "/media/profile.png";
    expect(getProfilePictureUrl(relative)).toBe(
      "http://localhost:8000/media/profile.png"
    );
  });
});

describe("extractErrorMessage", () => {
  const fallback = "fallback";

  it("extracts from JSON string with error.message", () => {
    const err = {
      responseText:
        '{"error":{"message":"boom"}}',
    };
    expect(
      extractErrorMessage(err, fallback)
    ).toBe("boom");
  });

  it("extracts plain responseText", () => {
    const err = { responseText: "plain error" };
    expect(
      extractErrorMessage(err, fallback)
    ).toBe("plain error");
  });

  it("falls back when nothing usable", () => {
    const err = {};
    expect(
      extractErrorMessage(err, fallback)
    ).toBe(fallback);
  });
});
