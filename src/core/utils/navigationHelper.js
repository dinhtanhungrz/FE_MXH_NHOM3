/**
 * Helper to wait for an element to appear in the DOM
 * @param {string} selector 
 * @param {number} timeout 
 * @returns {Promise<Element|null>}
 */
const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) return resolve(element);

    const observer = new MutationObserver((mutations) => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
};

/**
 * Handle scrolling and highlighting for notification redirection
 * @param {Object} route - The target route object
 */
export const handleNotificationScroll = async (route) => {
  if (!route) return;
  
  // Get query params from provided route
  const query = route.query;
  if (!query) return;

  const { postId, commentId } = query;
  
  // If neither postId nor commentId, nothing to do
  if (!postId && !commentId) return;

  console.log(`[NavigationHelper] Handling scroll for Post: ${postId}, Comment: ${commentId}`);

  // 1. Wait for the post element
  const postSelector = `article[data-post-id="${postId}"]`;
  const postElement = await waitForElement(postSelector);

  if (!postElement) {
    console.warn(`[NavigationHelper] Post ${postId} not found in DOM`);
    return;
  }

  // 2. If it's just a post or we have no commentId
  if (!commentId) {
    postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    postElement.classList.add('highlight-notification');
    setTimeout(() => postElement.classList.remove('highlight-notification'), 3000);
    return;
  }

  // 3. Handle Comment scrolling
  const commentSection = postElement.querySelector(`[id^="comment-section-"]`);
  if (commentSection && commentSection.classList.contains('hidden')) {
    const commentBtn = postElement.querySelector('.btn-comment');
    if (commentBtn) commentBtn.click();
  }

  // 4. Wait for the specific comment
  const commentSelector = `.comment-item[data-id="${commentId}"]`;
  const commentElement = await waitForElement(commentSelector);

  if (commentElement) {
    commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    commentElement.classList.add('highlight-notification');
    setTimeout(() => commentElement.classList.remove('highlight-notification'), 3000);
  } else {
    console.warn(`[NavigationHelper] Comment ${commentId} not found`);
    postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};
