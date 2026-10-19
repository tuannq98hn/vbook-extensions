load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let info = doc.select(".page-left .left-info .page-info").first();
    let author = "";
    let status = "";
    let description = "";
    let lines = [];
    info.select("p").forEach(function (p) {
        let label = p.select("span.info").text().trim();
        if (!label || label.indexOf("Thể Loại") !== -1) return;
        if (label.indexOf("Nội dung") !== -1) return;
        let text = p.text().trim();
        if (label.indexOf("Tác giả") !== -1) author = text.replace(label, "").trim();
        if (label.indexOf("Tình Trạng") !== -1) status = text;
        lines.push(text.replace(/Đăng nhập để theo dõi truyện/, "").replace(/♡/, "").replace(/\s*Lượt xem/, "<br>Lượt xem").trim());
    });
    let pre = info.select("p[style*=pre-wrap]").first();
    if (pre) description = pre.text();

    let genreLinks = info.select("a.tag");
    let genres = [];
    let first = genreLinks.first();
    if (first) genres.push({ title: "Cùng thể loại", input: absUrl(first.attr("href")), script: "search.js" });

    return Response.success({
        name: info.select("h1").text(),
        author: author,
        cover: doc.select(".page-ava img").attr("src"),
        description: description,
        detail: lines.join("<br>"),
        url: url,
        type: "comic",
        format: "comic",
        ongoing: status.toLowerCase().indexOf("hoàn thành") === -1,
        nsfw: true,
        tags: genreLinks.map(function (el) {
            return { title: el.text(), input: absUrl(el.attr("href")), script: "search.js" };
        }),
        genres: genres
    });
}
