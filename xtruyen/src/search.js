load('config.js');
// Listing pages and keyword search share the same ".popular-item-wrap" cards
// and "?page=N" pagination.
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url;
    if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
        url = query.indexOf("http") === 0 ? normalizeUrl(query) : BASE_URL + query;
    } else {
        url = BASE_URL + "/?s=" + encodeURIComponent(query) + "&post_type=wp-manga";
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + "page=" + page;

    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let items = doc.select(".popular-item-wrap").map(function (el) {
        let a = el.select(".widget-title a");
        return {
            name: a.text().trim(),
            cover: el.select(".popular-img img").attr("src"),
            link: a.attr("href"),
            description: el.select(".chapter a.btn-link").text().replace(/:\s*$/, ""),
            tag: el.select(".author a").text()
        };
    });

    // Listing pages use Bootstrap "Next" links; search uses a chevron link.
    let hasNext = doc.select(".pagination li:not(.disabled) a[aria-label=Next], .pagination a:has(.fa-chevron-right)").size() > 0;
    return Response.success(items, hasNext ? (parseInt(page) + 1).toString() : "");
}
