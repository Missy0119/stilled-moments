// --- 1. 背景大图与缩略图切换逻辑 ---
function changeImage(imageUrl, element) {
    const bgLayer = document.getElementById('hero-bg-layer');
    bgLayer.style.backgroundImage = `url('${imageUrl}')`;

    const mainImg = document.getElementById('main-foreground-image');
    mainImg.src = imageUrl;

    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
}

// --- 2. 页面无缝切换逻辑 ---
function showGallery() {
    const heroSection = document.querySelector('.hero');
    const gallerySection = document.getElementById('gallery-section');

    heroSection.style.display = 'none';
    gallerySection.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 3. 音乐控制逻辑 ---
const music = document.getElementById('bg-music');
const btn = document.getElementById('music-toggle');

function toggleMusic() {
    if (music.paused) {
        music.play();
        btn.innerHTML = '⏸ Pause Music';
    } else {
        music.pause();
        btn.innerHTML = '🎵 Play Music';
    }
}

function startMusicOnInteraction() {
    if (music.paused) {
        music.play().then(() => {
            btn.innerHTML = '⏸ Pause Music';
        }).catch((error) => {
            console.log("等待交互以播放音乐...");
        });
    }
}

document.addEventListener('click', startMusicOnInteraction, { once: true });
document.addEventListener('touchstart', startMusicOnInteraction, { once: true });

// ==========================================
// --- 4. 画廊图片点击放大逻辑 (大图详情页) ---
// ==========================================
function openDetail(imageSrc, title, location, camera) {
    document.getElementById('detail-bg-layer').style.backgroundImage = `url('${imageSrc}')`;
    document.getElementById('detail-main-image').src = imageSrc;

    document.getElementById('detail-title').innerText = title;
    document.getElementById('detail-location').innerText = location;
    document.getElementById('detail-camera').innerText = camera;

    document.getElementById('gallery-section').style.display = 'none';
    document.getElementById('detail-section').style.display = 'flex'; 

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeDetail() {
    document.getElementById('detail-section').style.display = 'none';
    document.getElementById('gallery-section').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================================
// --- 5. 核心合并：分类筛选、切歌、卡片点击与小圆圈动画 ---
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
    
    const filterBtns = document.querySelectorAll('.city-filters span');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const musicPlayer = document.getElementById('bg-music');
    const musicToggleBtn = document.getElementById('music-toggle');
    const customCursor = document.getElementById('custom-cursor');

    // A. 分类筛选 & 切歌功能
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 切换选中高亮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 筛选照片
            const selectedCategory = this.getAttribute('data-filter');
            galleryItems.forEach(item => {
                if (selectedCategory === '全部' || item.getAttribute('data-category') === selectedCategory) {
                    item.style.display = 'block'; 
                } else {
                    item.style.display = 'none';  
                }
            });
            
            // 无缝切歌
            const newMusicSrc = this.getAttribute('data-music'); 
            if (newMusicSrc && musicPlayer.getAttribute('src') !== newMusicSrc) {
                musicPlayer.src = newMusicSrc;
                musicPlayer.setAttribute('src', newMusicSrc); 
                musicPlayer.play().then(() => {
                    musicToggleBtn.innerHTML = '⏸ Pause Music';
                }).catch(e => console.log("切歌需交互", e));
            }
        });
    });

    // B. 照片卡片点击放大功能
    galleryItems.forEach(item => {
        // 核心修复：这里移除了强制变成手指的代码，保护了你的小圆圈！
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const title = this.querySelector('.item-title').innerText;
            const location = this.querySelector('.item-location').innerText;
            const camera = this.querySelector('.item-camera').innerText;
            
            openDetail(imgSrc, title, location, camera);
        });
    });

    // C. 变色小圆圈跟随与放大动画逻辑
    if (customCursor) {
        // 让圆圈跟着鼠标移动
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });

        // 识别所有可以互动的元素（卡片、按钮、顶部导航、首页缩略图）
        const hoverElements = document.querySelectorAll('.gallery-item, button, .thumbnail, .city-filters span');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('hover-active'); // 鼠标移入变大变实心
            });
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('hover-active'); // 移出恢复空心
            });
        });
    }
});

// C. 变色小圆圈跟随与放大动画逻辑（防卡顿优化版）
    if (customCursor) {
        let mouseX = 0;
        let mouseY = 0;
        let isScheduled = false; // 节拍器状态

        // 1. 鼠标移动时，只记录坐标，不立刻绘制
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // 如果浏览器还没准备好画下一帧，就不强迫它画
            if (!isScheduled) {
                // 告诉浏览器：在下一次重绘屏幕时，再更新圆圈位置
                requestAnimationFrame(() => {
                    customCursor.style.left = mouseX + 'px';
                    customCursor.style.top = mouseY + 'px';
                    isScheduled = false; // 画完了，重置节拍器
                });
                isScheduled = true;
            }
        });

        // 2. 鼠标移入移出的放大效果保持不变
        const hoverElements = document.querySelectorAll('.gallery-item, button, .thumbnail, .city-filters span');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('hover-active'); 
            });
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('hover-active'); 
            });
        });
    }