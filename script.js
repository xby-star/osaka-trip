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
    const commentsList = document.getElementById(`comments-${dayId}`);
    const commentText = commentInput.value.trim();

    if (commentText) {
        const comment = document.createElement('div');
        comment.className = 'comment';
        
        const currentDate = new Date().toLocaleString();
        const randomName = `游客${Math.floor(Math.random() * 1000)}`;
        
        comment.innerHTML = `
            <div class="comment-header">
                <span>${randomName}</span>
                <span>${currentDate}</span>
            </div>
            <div class="comment-content">${commentText}</div>
            <div class="comment-actions">
                <button onclick="likeComment(this)">👍 点赞</button>
                <button onclick="deleteComment(this)">🗑️ 删除</button>
            </div>
        `;
        
        commentsList.insertBefore(comment, commentsList.firstChild);
        commentInput.value = '';
        
        // 保存评论到本地存储
        saveComments();
    }
}

// 点赞功能
function likeComment(button) {
    const comment = button.closest('.comment');
    const likeCount = parseInt(button.textContent.split(' ')[1] || '0');
    button.textContent = `👍 ${likeCount + 1}`;
    saveComments();
}

// 删除评论
function deleteComment(button) {
    if (confirm('确定要删除这条评论吗？')) {
        const comment = button.closest('.comment');
        comment.remove();
        saveComments();
    }
}

// 保存评论到本地存储
function saveComments() {
    const comments = {};
    document.querySelectorAll('.comments-list').forEach(list => {
        const dayId = list.id.split('-')[1];
        comments[dayId] = Array.from(list.children).map(comment => ({
            content: comment.querySelector('.comment-content').textContent,
            author: comment.querySelector('.comment-header span').textContent,
            date: comment.querySelector('.comment-header span:last-child').textContent,
            likes: comment.querySelector('.comment-actions button').textContent
        }));
    });
    localStorage.setItem('tripComments', JSON.stringify(comments));
}

// 加载保存的评论
function loadComments() {
    const savedComments = localStorage.getItem('tripComments');
    if (savedComments) {
        const comments = JSON.parse(savedComments);
        Object.entries(comments).forEach(([dayId, dayComments]) => {
            const commentsList = document.getElementById(`comments-${dayId}`);
            if (commentsList) {
                dayComments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment';
                    commentElement.innerHTML = `
                        <div class="comment-header">
                            <span>${comment.author}</span>
                            <span>${comment.date}</span>
                        </div>
                        <div class="comment-content">${comment.content}</div>
                        <div class="comment-actions">
                            <button onclick="likeComment(this)">${comment.likes}</button>
                            <button onclick="deleteComment(this)">🗑️ 删除</button>
                        </div>
                    `;
                    commentsList.appendChild(commentElement);
                });
            }
        });
    }
}

// 页面加载时加载保存的评论
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