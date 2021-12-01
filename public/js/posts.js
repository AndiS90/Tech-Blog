const newCommentHandler = async (event) => {

    const post_id = event.target.getAttribute('data-id');
    const description = document.querySelector(`#comment${post_id}`).value.trim();

    if (description && post_id) {


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
            document.location.replace(`/posts/${post_id}`);
        } else {
            alert('Failed to add comment');
        }
    }
};

const commentforms = document.querySelectorAll('.comment-form')

commentforms.forEach(function (form) {
    form.addEventListener('submit', newCommentHandler);
});