let BASE_URL = "https://truyendich.us";
try {
    if (DOMAIN) {
        BASE_URL = DOMAIN;
    }
} catch (error) {
}

function normalizeUrl(url) {
    return url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
}

function absUrl(href) {
    return href && href.indexOf("/") === 0 ? BASE_URL + href : href;
}

// The site rate-limits request bursts (bulk download, long chapter lists) by
// 307-redirecting to /cooldown?seconds=N. fetch follows the redirect, so detect
// the cooldown landing page, wait out the window (capped), then retry.
function fetchPage(url) {
    let res = fetch(url);
    for (let attempt = 0; attempt < 2; attempt++) {
        let loc = res.url + " " + res.header("location");
        if (loc.indexOf("/cooldown") === -1) return res;
        let m = /seconds=(\d+)/.exec(loc);
        let wait = m ? parseInt(m[1]) : 60;
        sleep((Math.min(wait, 110) + 3) * 1000);
        res = fetch(url);
    }
    return res;
}

function isCooldown(res) {
    return (res.url + " " + res.header("location")).indexOf("/cooldown") !== -1;
}
