$(document).ready(() => {
  $.get('/news', (data) => {
    const articles = data.articles;
    let output = '';

    $.each(articles, (index, article) => {
      output += `
        <div class="article">
          <a href="${article.url}">
            <h2>${article.title}</h2>
            <img src="${article.urlToImage}">
            <p>${article.description}</p>
          </a>
        </div>
      `;
    });

    $('#articles').html(output);
  });
});
