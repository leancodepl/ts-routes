import { mkPath } from "./mkPath";

const routes = [
    { name: "home", path: "" },
    {
        name: "profile",
        path: "profile/",
        children: [
            { name: "profile", path: ":profileId" },
            { name: "edit", path: ":profileId/edit" },
        ],
    },
    {
        name: "settings",
        path: "settings/",
        children: [
            {
                name: "index",
                path: "",
            },
            { name: "general", path: "general/" },
            {
                name: "advanced",
                path: "advanced/",
            },
        ],
    },
] as const;

const path = mkPath(routes);

describe("mkPath", () => {
    it("should generate simple path", () => {
        expect(path("home")).toBe("/");
        expect(path("profile")).toBe("/profile/");
    });

    it("should generate index path for nested routes", () => {
        expect(path("settings", "index")).toBe("/settings/");
    });

    it("should generate path with params", () => {
        expect(path("profile", "profile", { profileId: "123" })).toBe("/profile/123");
    });

    it("should generate path with params in the middle of path", () => {
        expect(path("profile", "edit", { profileId: "123" })).toBe("/profile/123/edit");
    });

    it("should generate nested paths", () => {
        expect(path("settings", "general")).toBe("/settings/general/");
        expect(path("settings", "advanced")).toBe("/settings/advanced/");
    });

    it("should throw an error for invalid routes", () => {
        // @ts-expect-error: Invalid route
        expect(() => path("invalid")).toThrowError();
    });
});
