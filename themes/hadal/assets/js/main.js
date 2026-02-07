// Pagefind search integration (tasks 4.2-4.6)
(function () {
  'use strict';

  var pagefind = null;
  var activeIndex = -1;

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
    var input = document.getElementById('search-input');
    var statusEl = document.getElementById('search-status');
    var listEl = document.getElementById('search-results-list');
    var filtersEl = document.getElementById('search-filters');
    var langFilter = document.getElementById('filter-language');
    var catFilter = document.getElementById('filter-category');
    if (!input || !listEl) return;

    var debounceTimer = null;
    var filtersLoaded = false;

    // Show filters once the user starts typing
    input.addEventListener('focus', function () {
      if (!filtersLoaded) {
        loadFilters(langFilter, catFilter, filtersEl);
        filtersLoaded = true;
      }
    });

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      var query = input.value.trim();
      if (!query) {
        statusEl.textContent = '';
        listEl.textContent = '';
        activeIndex = -1;
        return;
      }
      debounceTimer = setTimeout(function () {
        performSearch(query, statusEl, listEl, langFilter, catFilter);
      }, 200);
    });

    // Filter changes re-trigger search
    if (langFilter) {
      langFilter.addEventListener('change', function () {
        var query = input.value.trim();
        if (query) performSearch(query, statusEl, listEl, langFilter, catFilter);
      });
    }
    if (catFilter) {
      catFilter.addEventListener('change', function () {
        var query = input.value.trim();
        if (query) performSearch(query, statusEl, listEl, langFilter, catFilter);
      });
    }

    // Keyboard navigation (task 4.6)
    input.addEventListener('keydown', function (e) {
      var items = listEl.querySelectorAll('[role="option"]');
      if (e.key === 'Escape') {
        input.value = '';
        statusEl.textContent = '';
        while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
        activeIndex = -1;
        input.blur();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length === 0) return;
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        updateActive(items, input);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length === 0) return;
        activeIndex = Math.max(activeIndex - 1, 0);
        updateActive(items, input);
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && items[activeIndex]) {
          e.preventDefault();
          var link = items[activeIndex].querySelector('a');
          if (link) link.click();
        }
      }
    });
  }

  function updateActive(items, input) {
    items.forEach(function (item, i) {
      if (i === activeIndex) {
        item.setAttribute('aria-selected', 'true');
        item.scrollIntoView({ block: 'nearest' });
        input.setAttribute('aria-activedescendant', item.id);
      } else {
        item.setAttribute('aria-selected', 'false');
      }
    });
  }

  async function loadFilters(langFilter, catFilter, filtersEl) {
    var pf = await loadPagefind();
    if (!pf) return;

    try {
      var filters = await pf.filters();
      if (filters.language) {
        Object.keys(filters.language).forEach(function (lang) {
          var opt = document.createElement('option');
          opt.value = lang;
          opt.textContent = lang;
          langFilter.appendChild(opt);
        });
      }
      if (filters.category) {
        Object.keys(filters.category).forEach(function (cat) {
          var opt = document.createElement('option');
          opt.value = cat;
          opt.textContent = cat;
          catFilter.appendChild(opt);
        });
      }
      if (filtersEl) filtersEl.hidden = false;
    } catch (e) {
      // Filters not available, keep hidden
    }
  }

  function clearChildren(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
    el.removeAttribute('role');
  }

  async function performSearch(query, statusEl, listEl, langFilter, catFilter) {
    var pf = await loadPagefind();
    if (!pf) {
      statusEl.textContent = 'Search is not available.';
      clearChildren(listEl);
      return;
    }

    // Build filter object from dropdowns (task 4.4)
    var filterOpts = {};
    if (langFilter && langFilter.value) {
      filterOpts.language = langFilter.value;
    }
    if (catFilter && catFilter.value) {
      filterOpts.category = catFilter.value;
    }

    var search = await pf.search(query, { filters: filterOpts });
    activeIndex = -1;

    if (search.results.length === 0) {
      statusEl.textContent = statusEl.dataset.noResults || 'No results found';
      clearChildren(listEl);
      return;
    }

    // ARIA live region announces result count (task 4.5)
    var countTemplate = statusEl.dataset.countTemplate || '{n} results found';
    statusEl.textContent = countTemplate.replace('{n}', search.results.length);

    var resultData = await Promise.all(
      search.results.slice(0, 10).map(function (r) { return r.data(); })
    );

    clearChildren(listEl);
    listEl.setAttribute('role', 'listbox');
    resultData.forEach(function (data, i) {
      var li = document.createElement('li');
      li.className = 'search-result-item';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.id = 'search-result-' + i;

      var a = document.createElement('a');
      a.href = data.url;
      a.tabIndex = -1;
      var strong = document.createElement('strong');
      strong.textContent = (data.meta && data.meta.title) ? data.meta.title : 'Untitled';
      a.appendChild(strong);
      li.appendChild(a);

      if (data.excerpt) {
        var p = document.createElement('p');
        p.className = 'search-excerpt';
        // Pagefind excerpts contain <mark> tags for highlights — use a
        // temporary element to sanitize and preserve only safe markup
        var temp = document.createElement('div');
        temp.textContent = data.excerpt;
        // Re-insert just the text (strip any injected HTML)
        p.textContent = temp.textContent;
        li.appendChild(p);
      }

      listEl.appendChild(li);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
