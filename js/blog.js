/*
  File: blog.js
  Made by: [Member Name] | ID: [Student ID]
*/
$(document).ready(function() {
  
  // DOM Identifiers
  const $homeGrid = $('#latest-blogs');
  const $blogPage = $('#blog-page-container');
  const $blogDetail = $('#blog-detail-container');
  
  // Set Pathing
  const isHomePage = $homeGrid.length > 0;
  const dataPath = isHomePage ? 'data/blogs.json' : '../data/blogs.json';
  
  $.getJSON(dataPath, function(data) {
      if (!data || data.length === 0) return;

      // ----------------------------------------------------
      // 1. INDEX.HTML (Homepage limited 3 Latest)
      // ----------------------------------------------------
      if (isHomePage) {
          $homeGrid.empty();
          const latest = data.slice(0, 3);
          
          latest.forEach(blog => {
              const dateStr = window.Utils && window.Utils.formatDate ? window.Utils.formatDate(blog.date) : blog.date;
              const excerpt = window.Utils && window.Utils.truncate ? window.Utils.truncate(blog.excerpt, 100) : blog.excerpt;
              const cardHtml = `
                  <div class="col-lg-4 col-md-6 mb-4">
                      <div class="course-card h-100 p-4 border d-flex flex-column text-start" style="border-radius: var(--radius-md); background: var(--color-surface);">
                          <div class="mb-3">
                              <span class="badge bg-light text-dark border">${blog.category}</span>
                          </div>
                          <h5 class="mb-2 fw-bold text-dark">${blog.title}</h5>
                          <div class="small text-secondary mb-3">By ${blog.author} · ${dateStr}</div>
                          <p class="text-secondary small mb-3 flex-grow-1">${excerpt}</p>
                          <div class="pt-3 border-top border-light mt-auto">
                              <a href="pages/blog-detail.html?id=${blog.id}" class="fw-semibold text-accent text-decoration-none hover-primary">Read More →</a>
                          </div>
                      </div>
                  </div>
              `;
              $homeGrid.append(cardHtml);
          });
      }

      // ----------------------------------------------------
      // 2. BLOG.HTML (Overview Grid + Featured)
      // ----------------------------------------------------
      if ($blogPage.length > 0) {
          // Feature First Item
          const featured = data[0];
          const featDateStr = window.Utils && window.Utils.formatDate ? window.Utils.formatDate(featured.date) : featured.date;
          
          $('#featured-category').text(featured.category);
          $('#featured-title').text(featured.title);
          $('#featured-excerpt').text(featured.excerpt);
          $('#featured-meta').text(`By ${featured.author} · ${featDateStr}`);
          $('#featured-link').attr('href', `./blog-detail.html?id=${featured.id}`);
          
          // Replace spinner with featured image
          const featImg = featured.image || '../assets/images/placeholder.jpg';
          $('#featured-post .spinner-border').parent().html(`<img src="${featImg}" class="w-100 h-100 object-fit-cover" alt="${featured.title}" style="min-height: 400px; border-left: 1px solid var(--color-border);">`);

          // Grid the rest (and feature if desired, prompt says "all 8 posts loaded" so we include all natively)
          const $grid = $('#blog-grid');
          $grid.empty();
          
          data.forEach(blog => {
              const dateStr = window.Utils && window.Utils.formatDate ? window.Utils.formatDate(blog.date) : blog.date;
              const excerpt = window.Utils && window.Utils.truncate ? window.Utils.truncate(blog.excerpt, 100) : blog.excerpt;
              
              const cardHtml = `
                  <div class="col-lg-4 col-md-6 mb-4 blog-card-wrapper" data-category="${blog.category}">
                      <div class="course-card h-100 p-4 border d-flex flex-column text-start" style="border-radius: var(--radius-md); background: var(--color-surface);">
                          <div class="mb-3">
                              <span class="badge bg-light text-dark border">${blog.category}</span>
                          </div>
                          <h5 class="mb-2 fw-bold text-dark">${blog.title}</h5>
                          <div class="small text-secondary mb-3">By ${blog.author} · ${dateStr}</div>
                          <p class="text-secondary small mb-3 flex-grow-1">${excerpt}</p>
                          <div class="pt-3 border-top border-light mt-auto">
                              <a href="./blog-detail.html?id=${blog.id}" class="fw-semibold text-accent text-decoration-none hover-primary">Read More →</a>
                          </div>
                      </div>
                  </div>
              `;
              $grid.append(cardHtml);
          });

          // Category Pill Filter Event
          $('.blog-filter').on('click', function(e) {
              e.preventDefault();
              $('.blog-filter').removeClass('active');
              $(this).addClass('active');

              const filterCat = $(this).data('filter');
              
              if (filterCat === 'All') {
                  $('.blog-card-wrapper').fadeIn(200);
              } else {
                  $('.blog-card-wrapper').hide();
                  $(`.blog-card-wrapper[data-category="${filterCat}"]`).fadeIn(200);
              }
          });
      }

      // ----------------------------------------------------
      // 3. BLOG-DETAIL.HTML (Individual Render & Aggregation)
      // ----------------------------------------------------
      if ($blogDetail.length > 0) {
          const id = window.Utils ? window.Utils.getUrlParam('id') : new URLSearchParams(window.location.search).get('id');
          if (!id) return;
          
          const post = data.find(p => p.id === id);
          if (!post) {
             $('#detail-loading').html('<div class="alert alert-danger mx-auto mt-5 w-50 text-center">Blog post not found.</div>');
             return;
          }

          const dateStr = window.Utils && window.Utils.formatDate ? window.Utils.formatDate(post.date) : post.date;

          // Main Header binding
          document.title = `OmniVault - ${post.title}`;
          $('#breadcrumb-title').text(post.title);
          $('#detail-category').text(post.category);
          $('#detail-title').text(post.title);
          $('#detail-meta').text(`By ${post.author} · ${dateStr}`);
          
          // Paragraph Parsing logic
          const contentSplits = post.content ? post.content.split('\n') : ["Data absent."];
          let formattedContent = "";
          contentSplits.forEach(str => {
             if (str.trim().length > 0) formattedContent += `<p style="line-height: 1.8; color: var(--color-text-secondary); margin-bottom: 24px; font-size: 16px;">${str}</p>`;
          });
          $('#detail-content').html(formattedContent);

          // SIDEBAR: Latest
          const latestPosts = data.slice(0, 3);
          const $sidebarLatest = $('#sidebar-latest');
          $sidebarLatest.empty();
          
          latestPosts.forEach(lp => {
              const lpDate = window.Utils && window.Utils.formatDate ? window.Utils.formatDate(lp.date) : lp.date;
              $sidebarLatest.append(`
                 <div class="mb-3 border-bottom border-light pb-3">
                     <a href="./blog-detail.html?id=${lp.id}" class="fw-semibold text-dark text-decoration-none d-block mb-1 hover-primary">${lp.title}</a>
                     <span class="small text-secondary fw-medium">${lpDate}</span>
                 </div>
              `);
          });

          // SIDEBAR: Category Distribution logic
          const categories = {};
          data.forEach(p => {
              categories[p.category] = (categories[p.category] || 0) + 1;
          });
          
          const $sidebarCats = $('#sidebar-categories');
          $sidebarCats.empty();
          Object.keys(categories).forEach(cat => {
              $sidebarCats.append(`
                  <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="text-secondary fw-semibold">${cat}</span>
                      <span class="badge border border-light text-dark bg-white px-2 py-1 fw-bold">${categories[cat]}</span>
                  </div>
              `);
          });

          $('#detail-loading').addClass('d-none');
          $('#detail-content-wrapper').removeClass('d-none');
      }

  }).fail(function() {
      console.error('Failed to parse blogs.json logic');
  });

});
