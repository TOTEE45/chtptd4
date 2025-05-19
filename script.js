async function generateArticle() {
  const geminiKey = document.getElementById('geminiKey').value.trim();
  const unsplashKey = document.getElementById('unsplashKey').value.trim();
  const topic = document.getElementById('topic').value.trim();

  if (!geminiKey || !unsplashKey || !topic) {
    alert("الرجاء إدخال جميع البيانات المطلوبة!");
    return;
  }

  document.getElementById('result').innerHTML = "⏳ جاري إنشاء المقال...";

  try {
    const prompt = `اكتب مقالة احترافية عن "${topic}" تشمل مقدمة، محتوى منظم، وخاتمة، مع فقرات واضحة.`;

    // 1. توليد المقال من Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const article = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم يتم إنشاء مقال 😢";

    // 2. جلب صورة من Unsplash
    const imageRes = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(topic)}&client_id=${unsplashKey}`);
    const imageData = await imageRes.json();
    const imageUrl = imageData?.urls?.regular || '';

    // 3. توليد وصف وكلمات مفتاحية
    const description = article.split(".").slice(0, 2).join(".") + ".";
    const keywords = extractKeywords(article);

    // 4. عرض المقال
    document.getElementById('result').innerHTML = `
      <div class="article">
        <img src="${imageUrl}" alt="${topic}">
        <h2>${topic}</h2>
        <p>${article.replace(/\n/g, '<br>')}</p>
        <div class="keywords">🔑 الكلمات المفتاحية: ${keywords.join(", ")}</div>
        <div class="actions">
          <button onclick="copyText(\`${escapeForJS(article)}\`)">📋 نسخ</button>
          <button onclick="downloadText('${article}', 'مقالة.txt')">⬇️ تحميل</button>
        </div>
        <div class="keywords">📝 وصف المقال: ${description}</div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    document.getElementById('result').innerHTML = "❌ حدث خطأ أثناء توليد المقال.";
  }
}

function escapeForJS(text) {
  return text.replace(/[`$\\]/g, '\\$&').replace(/\n/g, '\\n');
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("✅ تم نسخ المقال!");
  });
}

function downloadText(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function extractKeywords(text) {
  const words = text.match(/\b[\u0600-\u06FF\w]{4,}\b/g) || [];
  const freq = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}
