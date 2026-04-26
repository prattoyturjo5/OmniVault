/*
  File: xml-parser.js
  Made by: [Member Name] | ID: [Student ID]
*/
$(document).ready(function () {

  // --------------------------------------------------------
  // 1. INDEX.HTML: Homepage Notice Teaser Logic
  // --------------------------------------------------------
  if ($('#notice-board-teaser').length) {
    const isRoot = !window.location.pathname.includes('/pages/');
    const xmlUrl = isRoot ? 'data/notices.xml' : '../data/notices.xml';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', xmlUrl, true);
    xhr.onload = function () {
      if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
        const notices = xmlDoc.getElementsByTagName('notice');
        const $container = $('#notice-board-teaser');
        $container.empty();

        const count = Math.min(notices.length, 3);
        if (count === 0) {
          $container.html('<p class="text-secondary small">No recent announcements.</p>');
          return;
        }

        for (let i = 0; i < count; i++) {
          const title = notices[i].getElementsByTagName('title')[0].textContent;
          const date = notices[i].getElementsByTagName('date')[0].textContent;
          const dateFormatted = window.Utils && window.Utils.formatDate ? window.Utils.formatDate(date) : date;

          const body = notices[i].getElementsByTagName('content')[0].textContent;
          const imageEl = notices[i].getElementsByTagName('image')[0];
          const image = imageEl ? imageEl.textContent : '';
          const safeBody = body.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

          const itemHtml = `
            <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between border-bottom pb-3 mb-3 border-dark border-opacity-10">
              <div class="mb-2 mb-md-0 d-flex flex-column flex-md-row gap-md-3 align-items-md-center">
                 <span class="badge bg-white text-dark border py-2 px-3 fw-medium" style="min-width: 130px;">${dateFormatted}</span>
                 <strong class="text-dark fs-5 mt-2 mt-md-0">${title}</strong>
              </div>
              <button class="btn btn-primary-custom px-4 py-2 text-nowrap read-notice-btn" 
                      style="font-size: 14px; min-width: 100px;"
                      data-title="${title}" 
                      data-body="${safeBody}"
                      data-date="${dateFormatted}"
                      data-image="${image}"
                      data-bs-toggle="modal" 
                      data-bs-target="#noticeModal">
                View →
              </button>
            </div>
          `;
          $container.append(itemHtml);
        }
      } else {
        $('#notice-board-teaser').html('<p class="text-secondary small">Unable to load announcements at this time.</p>');
      }
    };
    xhr.onerror = function () {
      $('#notice-board-teaser').html('<p class="text-secondary small">Unable to load announcements.</p>');
    };
    xhr.send();
  }

  // --------------------------------------------------------
  // 2. NOTICEBOARD.HTML: Full Table Logic with Filtering
  // --------------------------------------------------------
  function loadNotices() {
    const $tbody = $('#notices-tbody');
    if ($tbody.length === 0) return;

    fetch('../data/notices.xml')
      .then(r => {
        if (!r.ok) throw new Error('Network response was not ok');
        return r.text();
      })
      .then(xmlText => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const notices = xmlDoc.querySelectorAll('notice');

        $tbody.empty();

        notices.forEach((notice, i) => {
          const title = notice.querySelector('title').textContent;
          const date = notice.querySelector('date').textContent;
          const category = notice.querySelector('category').textContent;
          const body = notice.querySelector('content').textContent;
          const imageEl = notice.querySelector('image');
          const image = imageEl ? imageEl.textContent : '';
          const dateFormatted = window.Utils && window.Utils.formatDate ? window.Utils.formatDate(date) : date;

          // Badge styling
          let badgeClass = "bg-light text-dark";
          if (category === "Exam") badgeClass = "bg-danger text-white";
          if (category === "Academic") badgeClass = "bg-info text-dark";
          if (category === "Administrative") badgeClass = "bg-warning text-dark";
          if (category === "Event") badgeClass = "bg-success text-white";

          const safeBody = body.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

          const tr = `
            <tr class="notice-row align-middle" data-category="${category}">
                <td class="text-secondary fw-semibold">${i + 1}</td>
                <td><span class="badge ${badgeClass} fw-semibold px-3 py-2 border border-light shadow-sm">${category}</span></td>
                <td class="fw-bold text-dark w-50">${title}</td>
                <td class="text-secondary small fw-medium">${dateFormatted}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary fw-semibold px-3 read-notice-btn" 
                            data-title="${title}" 
                            data-body="${safeBody}"
                            data-date="${dateFormatted}"
                            data-image="${image}"
                            data-bs-toggle="modal" 
                            data-bs-target="#noticeModal">
                        Read
                    </button>
                </td>
            </tr>
          `;
          $tbody.append(tr);
        });
      })
      .catch(error => {
        $tbody.html('<tr><td colspan="5" class="text-center text-danger">Failed to load notices properly.</td></tr>');
      });
  }

  // Bind Fetch to load if on the table page
  if ($('#notices-table').length) {
    loadNotices();
  }

  // Modal payload injection
  $(document).on('click', '.read-notice-btn', function () {
    const title = $(this).data('title');
    const body = $(this).data('body');
    const date = $(this).data('date');
    let image = $(this).data('image');
    if (image && !image.startsWith('http')) {
        // Adjust path if on home page (root) vs pages/ subfolder
        const isRoot = !window.location.pathname.includes('/pages/');
        if (isRoot && image.startsWith('../')) {
            image = image.replace('../', '');
        }
    }

    $('#noticeModalLabel').text(title);
    
    let contentHtml = `
          <p class="text-secondary small fw-bold mb-3">${date}</p>
          <p style="line-height:1.7; color: var(--color-text-secondary);">${body}</p>
    `;

    if (image) {
      contentHtml += `
        <div class="mt-4 p-3 border-0" style="background-color: #F7F8F0; border-radius: var(--radius-md);">
          <div class="mb-2 small fw-bold text-uppercase text-secondary" style="letter-spacing: 1px;">Attachment:</div>
          <div class="bg-white p-2 border" style="border: 1px solid rgba(53, 88, 114, 0.2) !important; border-radius: var(--radius-sm);">
            <img src="${image}" alt="Notice Image" class="img-fluid w-100 shadow-sm" style="border-radius: 2px;">
          </div>
        </div>
      `;
    }

    $('#noticeModalBody').html(contentHtml);
    
    // Add direct "Open File" button if there's an image
    if (image) {
        const directBtn = `<a href="${image}" target="_blank" class="btn btn-outline-primary w-100 mt-3 fw-bold">Open Full Document / Image ↗</a>`;
        $('#noticeModalBody').append(directBtn);
    }
  });

  // Category Pill Filtering
  $('.notice-filter').on('click', function (e) {
    e.preventDefault();
    $('.notice-filter').removeClass('active');
    $(this).addClass('active');

    const filterCat = $(this).data('filter');

    if (filterCat === 'All') {
      $('.notice-row').fadeIn(200);
    } else {
      $('.notice-row').hide();
      $(`.notice-row[data-category="${filterCat}"]`).fadeIn(200);
    }
  });

});
