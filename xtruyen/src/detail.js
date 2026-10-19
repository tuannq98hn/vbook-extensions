load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let status = "";
    let lines = [];
    doc.select(".post-content_item").forEach(function (el) {
        let label = el.select(".summary-heading h3").text().trim();
        let value = el.select(".summary-content").text().trim();
        if (!label || !value || label === "Đánh giá") return;
        if (label.indexOf("Trạng thái") !== -1) status = value;
        lines.push(label + ": " + value);
    });

    let genreLinks = doc.select(".genres-content a");
    let genres = [];
    let first = genreLinks.first();
    if (first) genres.push({ title: "Cùng thể loại", input: first.attr("href"), script: "search.js" });

    return Response.success({
        name: doc.select(".post-title h1").text().trim(),
        author: doc.select(".author-content a").text(),
        cover: doc.select(".summary_image img").attr("src"),
        description: doc.select(".description-summary .summary__content").html(),
        detail: lines.join("<br>"),
        url: url,
        type: "novel",
        format: "novel",
        ongoing: status.toLowerCase().indexOf("hoàn thành") === -1,
        tags: genreLinks.map(function (el) {
            return { title: el.text(), input: el.attr("href"), script: "search.js" };
        }),
        genres: genres
    });
}
