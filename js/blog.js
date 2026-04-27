/*
  File: blog.js
  Updated by: Gemini | Theme: Premier University
*/
$(document).ready(function () {

    // DOM Identifiers
    const $homeGrid = $('#latest-blogs');
    const $blogPage = $('#blog-page-container');
    const $blogDetail = $('#blog-detail-container');

    // Set Pathing
    const isHomePage = $homeGrid.length > 0;
    const dataPath = isHomePage ? 'data/blogs.json' : '../data/blogs.json';

    $.getJSON(dataPath, function (data) {
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
            // Force Custom Featured Content for Premier University
            const featured = data[0];
            const customTitle = "Empowering Premier University: The New Era of CSE Education";
            const customAuthor = "Raisul Islam";
            const customExcerpt = "OmniVault is officially partnering with the Premier University community to provide world-class Computer Science resources and academic excellence.";
            const featDateStr = "April 5"; // Hardcoded as requested

            $('#featured-category').text("Announcements");
            $('#featured-title').text(customTitle);
            $('#featured-excerpt').text(customExcerpt);
            $('#featured-meta').text(`By ${customAuthor} · ${featDateStr}`);
            $('#featured-link').attr('href', `./blog-detail.html?id=${featured.id}`);

            // Replace spinner with campus background image and title overlay
            const $imageContainer = $('#featured-post .spinner-border').parent();
            $imageContainer.html(`
                <div class="w-100 h-100 position-relative" 
                     style="background: url('../Images/151179702_534599881276239_3150779437365920771_n.jpg') center/cover no-repeat; min-height: 400px; border-left: 1px solid var(--color-border);">
                     <div class="p-4">
                        <span class="fs-5 fw-bold text-white" style="text-shadow: 0 2px 4px rgba(0,0,0,0.4);">Premier University CSE</span>
                     </div>
                </div>
            `);

            // Grid the rest
            const $grid = $('#blog-grid');
            $grid.empty();

            data.forEach((blog, index) => {
                // Apply the same custom naming to the first card in the grid if it matches the featured ID
                let displayTitle = blog.title;
                let displayAuthor = blog.author;
                if (index === 0) {
                    displayTitle = customTitle;
                    displayAuthor = customAuthor;
                }

                const dateStr = window.Utils && window.Utils.formatDate ? window.Utils.formatDate(blog.date) : blog.date;
                const excerpt = window.Utils && window.Utils.truncate ? window.Utils.truncate(blog.excerpt, 100) : blog.excerpt;

                const cardHtml = `
                  <div class="col-lg-4 col-md-6 mb-4 blog-card-wrapper" data-category="${blog.category}">
                      <div class="course-card h-100 p-4 border d-flex flex-column text-start" style="border-radius: var(--radius-md); background: var(--color-surface);">
                          <div class="mb-3">
                              <span class="badge bg-light text-dark border">${blog.category}</span>
                          </div>
                          <h5 class="mb-2 fw-bold text-dark">${displayTitle}</h5>
                          <div class="small text-secondary mb-3">By ${displayAuthor} · ${dateStr}</div>
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
            $('.blog-filter').on('click', function (e) {
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
        // 3. BLOG-DETAIL.HTML
        // ----------------------------------------------------
        if ($blogDetail.length > 0) {
            const id = window.Utils ? window.Utils.getUrlParam('id') : new URLSearchParams(window.location.search).get('id');
            if (!id) return;

            const post = data.find(p => p.id === id);
            if (!post) {
                $('#detail-loading').html('<div class="alert alert-danger mx-auto mt-5 w-50 text-center">Blog post not found.</div>');
                return;
            }

            // If this is the first post, override details
            const isFirstPost = data[0].id === id;
            const displayTitle = isFirstPost ? "Empowering Premier University: The New Era of CSE Education" : post.title;
            const displayAuthor = isFirstPost ? "Raisul Islam" : post.author;
            const dateStr = window.Utils && window.Utils.formatDate ? window.Utils.formatDate(post.date) : post.date;

            document.title = `OmniVault - ${displayTitle}`;
            $('#breadcrumb-title').text(displayTitle);
            $('#detail-category').text(post.category);
            $('#detail-title').text(displayTitle);
            $('#detail-meta').text(`By ${displayAuthor} · ${dateStr}`);

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

            latestPosts.forEach((lp, i) => {
                const lpTitle = (i === 0) ? "Empowering Premier University: The New Era of CSE Education" : lp.title;
                const lpDate = window.Utils && window.Utils.formatDate ? window.Utils.formatDate(lp.date) : lp.date;
                $sidebarLatest.append(`
                 <div class="mb-3 border-bottom border-light pb-3">
                     <a href="./blog-detail.html?id=${lp.id}" class="fw-semibold text-dark text-decoration-none d-block mb-1 hover-primary">${lpTitle}</a>
                     <span class="small text-secondary fw-medium">${lpDate}</span>
                 </div>
              `);
            });

            // SIDEBAR: Categories
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

    }).fail(function () {
        console.error('Failed to parse blogs.json');
    });

});