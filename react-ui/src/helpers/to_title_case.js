export function toTitleCase(text) {
    return text?.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}
