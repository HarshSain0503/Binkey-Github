export const validUrlConvert = (name) => {
    // Validate the input
    if (!name || typeof name !== "string") {
        console.warn("Invalid input for URL conversion:", name);
        return "invalid"; // Default fallback slug
    }

    // Convert the name to a valid URL format
    const url = name
        .toString()
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll(",", "-")
        .replaceAll("&", "-")
        .replace(/[^a-z0-9-]+/g, "") // Remove invalid characters
        .replace(/^-|-$/g, ""); // Remove leading or trailing hyphens

    return url;
};

export default validUrlConvert;
