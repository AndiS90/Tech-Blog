const description = document.querySelector('#comment').value.trim();

const newCommentHandler = async (event) => {
  if (description && event.target.hasAttribute('data-id')) {
    const post_id = event.target.getAttribute('data-id')

    const response = await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({
        post_id,
        description
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to add comment');
    }
  }
};

document
  .querySelector('.comment-form')
  .addEventListener('submit', newCommentHandler);