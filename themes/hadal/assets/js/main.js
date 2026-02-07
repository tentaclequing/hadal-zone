// Pagefind search integration (tasks 4.3-4.6)
(function () {
  'use strict';

  let pagefind = null;

  async function loadPagefind() {
    if (pagefind) return pagefind;
    try {
      pagefind = await import('/hadal-zone/pagefind/pagefind.js');
      await pagefind.init();
      return pagefind;
    } catch (e) {
      console.warn('Pagefind not available — search disabled.', e);
      return null;
    }
  }

  function init() {
    const input = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    if (!input || !resultsContainer) return;

    let debounceTimer = null;

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      const query = input.value.trim();
      if (!query) {
        resultsContainer.innerHTML = '';
        return;
      }
      debounceTimer = setTimeout(function () {
        performSearch(query, resultsContainer);
      }, 200);
    });

    // Keyboard navigation: Escape clears search
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        input.value = '';
        resultsContainer.innerHTML = '';
        input.blur();
      }
    });
  }

  async function performSearch(query, container) {
    const pf = await loadPagefind();
    if (!pf) {
      container.innerHTML = '<p class="search-status">Search is not available.</p>';
      return;
    }

    const search = await pf.search(query);

    if (search.results.length === 0) {
      container.innerHTML = '<p class="search-status search-no-results">No results found</p>';
      return;
    }

    // ARIA live region announces result count
    const countText = search.results.length + ' results found';
    let html = '<p class="search-status search-count" aria-live="polite">' + countText + '</p>';
    html += '<ul class="search-results-list" role="list">';

    const resultData = await Promise.all(
      search.results.slice(0, 10).map(function (r) { return r.data(); })
    );

    resultData.forEach(function (data) {
      html += '<li class="search-result-item">';
      html += '<a href="' + data.url + '">';
      html += '<strong>' + (data.meta && data.meta.title ? data.meta.title : 'Untitled') + '</strong>';
      html += '</a>';
      if (data.excerpt) {
        html += '<p class="search-excerpt">' + data.excerpt + '</p>';
      }
      html += '</li>';
    });

    html += '</ul>';
    container.innerHTML = html;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
