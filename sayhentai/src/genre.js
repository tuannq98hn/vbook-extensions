load('config.js');
function execute() {
    let response = fetch(BASE_URL + "/the-loai");
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let genres = doc.select("#menu-header .dropdown-menu a[href*=/the-loai/]").map(function (el) {
        return {
            title: el.text().replace(/^-\s*/, ""),
            input: el.attr("href"),
            script: "search.js"
        };
    });

    return Response.success(genres);
}
