document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  const nav = document.querySelector('header > nav');
  const header = document.querySelector('header');
  const toc = document.querySelector('nav.toc');

  updateFilePath();
  initHashNav();
  initMenu();
  initNav();

  function initHashNav() {
    document
      .querySelectorAll('a')
      .forEach(anchor => {
        const href = anchor.getAttribute('href');

        if (href.startsWith("#")) {
          anchor.addEventListener('click', e => {
            e.preventDefault();

            if (href === '#') {
              history.replaceState({}, document.title, window.location.pathname + window.location.search);
            } else {
              window.location.hash = href;
            }
          })
        }
      });
  }

  function initMenu() {
    const navButton = document.getElementById('nav-item');

    navButton.addEventListener('click', onNavItemClick);

    function onNavItemClick() {
      if (isNavShowing()) {
        hideNav();
      } else {
        showNav();
      }
    }
  }

  function initNav() {
    const anchors = document.querySelectorAll('nav.toc a');
    let mobile = isMobile();

    const updateSelectedAnchor = hash => {
      anchors.forEach(anchor => {
        if (anchor.getAttribute('href') === hash) {
          anchor.classList.add('selected');
          makeAnchorVisibleInNav(anchor);
        } else {
          anchor.classList.remove('selected');
        }
      });
    };


    anchors.forEach(anchor => {
      anchor.addEventListener('click', event => {
        event.preventDefault();
        if (mobile) {
          hideNav();
        }
        scrollTo(anchor);
      });
    });
    updateSelectedAnchor(window.location.hash);

    if (!mobile) {
      showNav();
    }

    window.addEventListener('hashchange', () => updateSelectedAnchor(window.location.hash));
    window.addEventListener('scroll', selectAnchorFromScrollPosition);
    window.addEventListener('load', scrollToHashHeading);
    window.addEventListener('resize', () => {
      const newMobile = isMobile();

      if (newMobile !== mobile) {
        // Changed from desktop to mobile
        if (newMobile) {
          hideNav();
        } else {
          showNav();
        }
        mobile = newMobile;
      }
    });


    function makeAnchorVisibleInNav(anchor) {
      const anchorRect = anchor.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();

      if (anchorRect.top < navRect.top || anchorRect.bottom > navRect.bottom) {
        nav.scrollTo({
          top: anchorRect.top + navRect.height / 2,
          behavior: 'smooth',
        });
      }
    }

    function selectAnchorFromScrollPosition() {
      const focusedHeading = getFocusedHeading();
      const headingId = focusedHeading.getAttribute('id');
      const hash = `#${headingId}`;

      if (headingId) {
        updateSelectedAnchor(hash);
      }
    }

    function scrollToHashHeading() {
      if (!window.location.hash.startsWith('#')) {
        return;
      }
      const hash = window.location.hash;
      const heading = document.querySelector(hash);
      heading.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  function isNavShowing() {
    return header.classList.contains('show');
  }

  function showNav() {
    header.classList.add('show');

    if (toc) {
      toc.classList.add('show');
    }
  }

  function hideNav() {
    header.classList.remove('show');

    if (toc) {
      toc.classList.remove('show');
    }
  }

  function isMobile() {
    return window.innerWidth < 1280;
  }
}

function scrollTo(anchor) {
  if (!anchor.href) {
    return;
  }
  const href = anchor.attributes.href.value;
  const targetId = href.substring(href.indexOf('#'));

  if (targetId === '#') {
    document.body.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    return;
  }

  const targetSection = document.querySelector(targetId);

  if (targetSection) {
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

function getFocusedHeading() {
  const headings = selectHeadings();
  const isVisible = heading => {
    const rect = heading.getBoundingClientRect();
    return rect.bottom >= 0 && rect.bottom < window.innerHeight
  };
  const visibleHeadings = [];
  let invisibleHeadingClosestToTop = headings[0];

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];

    if (isVisible(heading)) {
      visibleHeadings.push(heading);
    }
    // Check for the heading right above the page
    else {
      const rect = heading.getBoundingClientRect();
      const maxRect = invisibleHeadingClosestToTop.getBoundingClientRect();

      if (rect.bottom < 0) {
        if (rect.bottom > maxRect.bottom) {
          invisibleHeadingClosestToTop = heading;
        }
      }
    }
  }

  // Return the closest heading if none is visible
  if (visibleHeadings.length === 0) {
    return invisibleHeadingClosestToTop;
  }

  // Return the heading in the top 1/3 of the page (normal behavior)
  for (const heading of visibleHeadings) {
    const rect = heading.getBoundingClientRect();

    if (rect.top < window.innerHeight / 3) {
      return heading;
    }
  }
  return invisibleHeadingClosestToTop;
}

function updateFilePath() {
  const pageTitle = document.querySelector('h1').textContent;

  // It's a file like DataTest.java
  // This path update is necessary since Netlify lowercase the path
  if (pageTitle.includes('.')) {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/');

    pathSegments[pathSegments.length - 1] = pageTitle;
    const newPath = pathSegments.join('/');

    history.replaceState(null, null, newPath);
  }
}

function selectHeadings() {
  return document.querySelectorAll('h1, h2, h3, h4, h5, h6');
}
