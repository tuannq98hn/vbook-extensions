load('config.js');
// The chapter list is split into /trang-N pages of 50 chapters each.
function execute(url) {
    url = normalizeUrl(url).replace(/\/trang-\d+\/?$/, "").replace(/\/+$/, "");
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let total = 0;
    doc.select("main div.p-4:has(span):has(p)").forEach(function (el) {
        if (el.select("span").first().text().trim().toLowerCase() === "số chương") {
            total = parseInt(el.select("p").first().text().replace(/[^0-9]/g, "")) || 0;
        }
    });

    let pages = [];
    let count = Math.max(1, Math.ceil(total / 50));
    for (let i = 1; i <= count; i++) pages.push(url + "/trang-" + i);
    return Response.success(pages);
}
