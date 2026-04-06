/*
  File: courses.js
  Made by: [Member Name] | ID: [Student ID]
*/
$(document).ready(function() {
  let allCourses = [];
  
  // Detect current logic environment based on unique DOM IDs
  const isHomePage = $('#featured-courses').length > 0;
  const isCoursesPage = $('#courses-page-container').length > 0;
  
  const initialCount = isHomePage ? 6 : 100; // Limits on homepage, shows all on catalog
  let visibleCount = initialCount;

  // Path resolution: if we are on homepage fetch from /data, if inside pages/, fetch from ../data
  const dataPath = isHomePage ? 'data/courses.json' : '../data/courses.json';

  $.getJSON(dataPath, function(data) {
    allCourses = data;
    renderCourses();
  }).fail(function() {
    console.error("Failed to load courses.json from " + dataPath);
  });

  function renderCourses() {
    const $grid = $('#courses-grid');
    if ($grid.length === 0) return;
    $grid.empty();

    let filtered = allCourses;

    if (isHomePage) {
        // --- 1. HOME PAGE FILTERING ---
        const filterDept = $('.course-filter.active').data('filter') || 'All';
        const searchQuery = $('#hero-search').length ? $('#hero-search').val().toLowerCase() : '';

        if (filterDept !== 'All') {
          filtered = filtered.filter(c => c.department === filterDept);
        }
        if (searchQuery) {
          filtered = filtered.filter(c => 
            c.title.toLowerCase().includes(searchQuery) || 
            c.instructor.toLowerCase().includes(searchQuery) ||
            c.department.toLowerCase().includes(searchQuery)
          );
        }
    } else if (isCoursesPage) {
        // --- 2. COURSES CATALOG PAGE FILTERING (SIDEBAR) ---
        const searchQuery = $('#catalog-search').val() ? $('#catalog-search').val().toLowerCase() : '';
        
        const selectedDepts = [];
        $('.dept-checkbox:checked').each(function() {
            selectedDepts.push($(this).val());
        });

        const selectedLevel = $('input[name="levelRadio"]:checked').val() || 'All';
        const selectedDuration = $('#durationSelect').val() || 'Any';

        // Filter Dept (AND logic against other filters, OR logic amongst inner checkbox group)
        if (selectedDepts.length > 0) {
            filtered = filtered.filter(c => selectedDepts.includes(c.department));
        }

        // Filter Level
        if (selectedLevel !== 'All' && selectedLevel) {
            filtered = filtered.filter(c => c.level === selectedLevel);
        }

        // Filter Search Text
        if (searchQuery) {
            filtered = filtered.filter(c => 
                c.title.toLowerCase().includes(searchQuery) || 
                c.instructor.toLowerCase().includes(searchQuery)
            );
        }

        // Filter Duration
        if (selectedDuration !== 'Any' && selectedDuration) {
            filtered = filtered.filter(c => {
                const wks = parseInt(c.duration);
                if (isNaN(wks)) return true;
                if (selectedDuration === 'Under 8') return wks < 8;
                if (selectedDuration === '8-16') return wks >= 8 && wks <= 16;
                if (selectedDuration === '16+') return wks > 16;
                return true;
            });
        }
    }

    // Dynamic UI count
    if ($('#count-display').length) {
        $('#count-display').text(`Showing ${filtered.length} of ${allCourses.length} courses`);
    }

    if (filtered.length === 0) {
      $grid.html('<div class="col-12"><div class="empty-state p-5 text-center bg-light border border-light rounded shadow-sm text-secondary">No courses match your filters. Try adjusting your parameters.</div></div>');
      if(isHomePage) $('#load-more-courses').hide();
      return;
    }

    const toShow = filtered.slice(0, visibleCount);
    
    // Inject elements
    toShow.forEach(course => {
      // Relative path adjustments
      const linkHref = isHomePage ? `pages/course-detail.html?id=${course.id}` : `./course-detail.html?id=${course.id}`;
      
      const cardHtml = `
        <div class="col-lg-4 col-md-6 col-12 mb-4">
          <div class="course-card h-100 d-flex flex-column border" style="border-radius: var(--radius-md); background: var(--color-surface); padding: 24px;">
            <div class="mb-3">
              <span class="dept-tag dept-${course.department.toLowerCase()}">${course.department}</span>
            </div>
            <h5 class="mb-2 fw-bold text-dark">${course.title}</h5>
            <p class="text-secondary small mb-3 flex-grow-1">${course.instructor}</p>
            <div class="d-flex justify-content-between align-items-center pt-3 border-top border-light mt-auto">
              <span class="small text-secondary fw-medium">${course.duration} · ${course.credits} Credits</span>
              <a href="${linkHref}" class="fw-semibold text-accent text-decoration-none hover-primary text-nowrap">View Course →</a>
            </div>
          </div>
        </div>
      `;
      $grid.append(cardHtml);
    });

    // Pagination logic (Homepage specific)
    if (isHomePage) {
        if (visibleCount >= filtered.length) {
            $('#load-more-courses').hide();
        } else {
            $('#load-more-courses').show();
        }
    }
  }

  // --- HomePage Specific Triggers ---
  $('.course-filter').on('click', function() {
    $('.course-filter').removeClass('active');
    $(this).addClass('active');
    visibleCount = initialCount;
    renderCourses();
  });

  $('#hero-search').on('keyup', function() {
    visibleCount = initialCount;
    renderCourses();
  });

  $('#load-more-courses').on('click', function() {
    visibleCount += 6;
    renderCourses();
  });

  // --- Courses Catalog Multi-Filter Triggers ---
  
  // Search Bar
  let debounceTimeout;
  $('#catalog-search').on('keyup', function() {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
          renderCourses();
      }, 300);
  });
  
  // Checkboxes & Radios
  $('.dept-checkbox').on('change', renderCourses);
  $('input[name="levelRadio"]').on('change', renderCourses);
  
  // Dropdown
  $('#durationSelect').on('change', renderCourses);

  // Reset Everything via clear button
  $('#reset-filters').on('click', function(e) {
      e.preventDefault();
      
      // Clear inputs securely
      $('#catalog-search').val('');
      $('.dept-checkbox').prop('checked', false);
      $('#level-all').prop('checked', true); 
      $('#durationSelect').val('Any');
      
      // Re-render
      renderCourses();
  });
});
