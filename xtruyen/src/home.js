function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "/truyen/?m_orderby=latest", script: "search.js" },
        { title: "Truyện HOT", input: "/truyen/?m_orderby=trending", script: "search.js" },
        { title: "Phổ biến nhất", input: "/truyen/?m_orderby=views", script: "search.js" },
        { title: "Hoàn thành", input: "/truyen/?m_orderby=trending&status=end", script: "search.js" }
    ]);
}
