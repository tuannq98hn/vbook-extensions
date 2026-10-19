load('config.js');
// Listing and search pages use different card layouts; both wrap the cover
// <img> in a link to /doc-truyen/<slug>. Pagination is client-side, so keep
// paging until a page comes back empty.
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url;
    if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
        url = query.indexOf("http") === 0 ? normalizeUrl(query) : BASE_URL + query;
    } else {
        url = BASE_URL + "/tim-kiem?q=" + encodeURIComponent(query);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + "page=" + page;

    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let seen = {};
    let items = [];
    doc.select("main a[href^=/doc-truyen/]:has(img)").forEach(function (el) {
        let href = el.attr("href");
        if (href.split("/").length !== 3 || seen[href]) return;
        seen[href] = true;
        let img = el.select("img").first();
        items.push({
            name: img.attr("alt").replace(/^Ảnh bìa truyện\s*/, ""),
            cover: absUrl(img.attr("src")),
            link: absUrl(href),
            description: "",
            tag: ""
        });
    });

    return Response.success(items, items.length > 0 ? (parseInt(page) + 1).toString() : "");
}
