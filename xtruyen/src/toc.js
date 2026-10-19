load('config.js');
// The chapter list comes from a JSON API that returns at most ~200 chapters
// per call and requires the site's fixed X-Custom-Auth header.
function execute(url) {
    url = normalizeUrl(url);
    if (url.charAt(url.length - 1) !== "/") url += "/";
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let mangaId = doc.select("input.rating-post-id").attr("value");
    if (!mangaId) return Response.error("Không tìm thấy ID truyện");

    let chapters = [];
    let step = 200;
    for (let from = 1; from < 100000; from += step) {
        let res = fetch(BASE_URL + "/api/api-chapters.php", {
            method: "POST",
            headers: {
                "X-Custom-Auth": "abC0000011111",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": url
            },
            body: { manga_id: mangaId, from: String(from), to: String(from + step - 1), vol: "" }
        });
        if (!res.ok) return Response.error("HTTP " + res.status);
        let list = res.json();
        if (!list || list.length === 0) break;
        for (let i = 0; i < list.length; i++) {
            let c = list[i];
            chapters.push({
                name: c.n + (c.e ? c.e.replace(/^[\s:]+/, ": ") : ""),
                url: url + c.s + "/",
                description: "",
                lock: false,
                pay: false
            });
        }
        if (list.length < step) break;
    }

    return Response.success(chapters);
}
