load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    // The list is streamed into a hidden block outside <main>. Every page also
    // repeats a "Mới cập nhật" block of the latest chapters, marked by a red
    // accent bar; skip it.
    let chapters = [];
    doc.select("a[href*=/chuong-]:has(.tabular-nums)").forEach(function (el) {
        if (el.select("div.bg-red-500").size() > 0) return;
        let number = el.select(".tabular-nums").first().text().trim();
        let title = el.select("span").first().text().trim();
        chapters.push({
            name: title.indexOf(number) === -1 && title.toLowerCase().indexOf("chương") === -1
                ? "Chương " + number + ": " + title : title,
            url: absUrl(el.attr("href")),
            description: "",
            lock: false,
            pay: false
        });
    });

    return Response.success(chapters);
}
