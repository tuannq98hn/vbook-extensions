load('config.js');
function execute() {
    let response = fetch(BASE_URL + "/");
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let seen = {};
    let genres = [];
    doc.select("a[href*=/theloai/]").forEach(function (el) {
        let href = el.attr("href");
        let title = el.text().trim();
        if (!title || href.indexOf(BASE_URL.replace(/^https?:\/\//, "")) === -1 || seen[href]) return;
        seen[href] = true;
        genres.push({ title: title, input: href, script: "search.js" });
    });

    return Response.success(genres);
}
