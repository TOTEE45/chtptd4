document.addEventListener('DOMContentLoaded', function() {
    const articles = [
        {
            title: "مقدمة في تعلم الآلة",
            content: "تعلم الأساسيات الأولى لخوارزميات تعلم الآلة",
            date: "15 مايو 2023"
        },
        {
            title: "أحدث تطبيقات الذكاء الاصطناعي",
            content: "كيف تقوم الشركات باستخدام الذكاء الاصطناعي",
            date: "10 مايو 2023"
        }
    ];

    const container = document.getElementById('articles-container');
    
    articles.forEach(article => {
        const articleEl = document.createElement('div');
        articleEl.className = 'article';
        articleEl.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <small>${article.date}</small>
        `;
        container.appendChild(articleEl);
    });
});
