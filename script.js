// 返回顶部按钮功能
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'flex';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 图片点击放大功能
document.querySelectorAll('.trip-image').forEach(image => {
    image.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <img src="${image.src}" alt="${image.alt}">
            </div>
        `;
        document.body.appendChild(modal);

        const closeButton = modal.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    });
});

// 评论功能
function addComment(dayId) {
    const commentInput = document.getElementById(`comment-input-${dayId}`);
    const commentText = commentInput.value.trim();

    if (commentText) {
        const currentDate = new Date().toLocaleString();
        const randomName = `游客${Math.floor(Math.random() * 1000)}`;
        
        const commentData = {
            content: commentText,
            author: randomName,
            date: currentDate,
            likes: 0,
            dayId: dayId
        };

        // 保存评论到Firebase
        const commentsRef = database.ref('comments');
        commentsRef.push(commentData).then(() => {
            commentInput.value = '';
        }).catch(error => {
            console.error('Error saving comment:', error);
            alert('评论保存失败，请稍后重试');
        });
    }
}

// 点赞功能
function likeComment(commentId, currentLikes) {
    const commentRef = database.ref(`comments/${commentId}`);
    commentRef.update({
        likes: currentLikes + 1
    }).catch(error => {
        console.error('Error updating likes:', error);
        alert('点赞失败，请稍后重试');
    });
}

// 删除评论
function deleteComment(commentId) {
    if (confirm('确定要删除这条评论吗？')) {
        const commentRef = database.ref(`comments/${commentId}`);
        commentRef.remove().catch(error => {
            console.error('Error deleting comment:', error);
            alert('删除失败，请稍后重试');
        });
    }
}

// 加载评论
function loadComments() {
    const commentsRef = database.ref('comments');
    commentsRef.on('value', (snapshot) => {
        const comments = snapshot.val();
        if (comments) {
            // 清空所有评论列表
            document.querySelectorAll('.comments-list').forEach(list => {
                list.innerHTML = '';
            });

            // 按日期排序评论
            const sortedComments = Object.entries(comments)
                .map(([id, comment]) => ({ id, ...comment }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            // 显示评论
            sortedComments.forEach(comment => {
                const commentsList = document.getElementById(`comments-${comment.dayId}`);
                if (commentsList) {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment';
                    commentElement.innerHTML = `
                        <div class="comment-header">
                            <span>${comment.author}</span>
                            <span>${comment.date}</span>
                        </div>
                        <div class="comment-content">${comment.content}</div>
                        <div class="comment-actions">
                            <button onclick="likeComment('${comment.id}', ${comment.likes})">👍 ${comment.likes}</button>
                            <button onclick="deleteComment('${comment.id}')">🗑️ 删除</button>
                        </div>
                    `;
                    commentsList.appendChild(commentElement);
                }
            });
        }
    });
}

// 页面加载时加载评论
document.addEventListener('DOMContentLoaded', loadComments);

// 添加平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 