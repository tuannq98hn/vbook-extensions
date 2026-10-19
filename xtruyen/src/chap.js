load('config.js');
// Chapter text is shipped encrypted and decoded by an obfuscated script, so
// let a headless WebView render the page and read the decoded text. launch()
// never returns on this site (the page keeps loading), so poll instead.
function execute(url) {
    url = normalizeUrl(url);
    let browser = Engine.newBrowser();
    browser.launchAsync(url);
    let content = "";
    for (let i = 0; i < 12; i++) {
        let el = browser.html(1500).select("#chapter-reading-content").first();
        if (el && el.text().length > 50) {
            el.select("script, style, #loading-box, [class^=aam-]").remove();
            content = el.html();
            break;
        }
    }
    browser.close();

    if (!content) return Response.error("Không tải được nội dung chương");
    return Response.success(content);
}
