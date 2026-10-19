load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let content = doc.select("section[itemprop=text] #original-content-tab").first();
    if (!content) content = doc.select("section[itemprop=text]").first();
    if (!content || content.text().length < 20) return Response.error("Không tìm thấy nội dung chương");
    content.select("script, style, ins, iframe, [class*=ads], [id*=ads], content").remove();
    content.select("p").forEach(function (p) {
        if (!p.text().trim()) p.remove();
    });
    return Response.success(content.html());
}
