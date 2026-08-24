// --- 电影感开场：控制 Loading 与动画时间线 ---
document.addEventListener('DOMContentLoaded', () => {
    // 设定 Loading 持续时间 (这里设为 3.5 秒，你可以根据需要调整)
    const loadingDuration = 3500; 

    setTimeout(() => {
        // 1. 隐藏 Loading 字样
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 1000); // 1秒后彻底移出文档流

        // 2. 视频无缝切换 (前导视频变透明，主视频显现并开始播放)
        const video1 = document.getElementById('loading-video');
        const video2 = document.getElementById('main-video');
        video1.style.opacity = '0';
        video2.style.opacity = '1';
        video2.play();

        // 3. 让主界面内容区可以被点击
        const heroContent = document.getElementById('hero-content');
        heroContent.style.opacity = '1';
        heroContent.style.pointerEvents = 'auto';

        // 4. 文字逐个浮现动画 (Staggered Animation)
        const fadeItems = document.querySelectorAll('.fade-item');
        fadeItems.forEach((item, index) => {
            // 利用 index 制造时间差，比如第一个元素立刻显示，第二个等 0.2 秒...
            setTimeout(() => {
                item.classList.add('show');
            }, index * 200); // 间隔 200 毫秒，你可以调大这个数值让动画更慢更连贯
        });

    }, loadingDuration);
});

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

// --- 杂志风画报：点击缩略图切换大图逻辑 ---
// --- 杂志风画报：点击缩略图切换大图逻辑 ---
// --- 杂志风画报：点击缩略图切换大图逻辑 ---
function changeEditorialContent(element, imgSrc, caption, num, quote, author) {
    // 1. 切换左侧大图和底部的图注
    document.getElementById('editorial-main-img').src = imgSrc;
    document.getElementById('editorial-caption').innerText = caption;

    // 2. 动态刷新右侧对应的编号和引言正文
    document.getElementById('editorial-num').innerText = num;
    // 👇 核心修改：去掉了包围在 quote 两边的双引号 👇
    document.getElementById('editorial-quote').innerHTML = quote;

    // 3. 更新缩略图的 active 高亮状态
    const thumbs = document.querySelectorAll('.ed-thumb');
    thumbs.forEach(thumb => {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
}
// --- 滚动浮现 (Scroll Reveal) 侦测逻辑 ---
document.addEventListener('DOMContentLoaded', () => {
    // 设置侦测雷达：当元素有 15% 进入屏幕视野时触发
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视野，加上 active 类触发动画
                entry.target.classList.add('active');
                // 如果你希望滑上去再滑下来时动画不再重复，可以取消注释下面这行：
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // 找到页面上所有带有 reveal-up 类的元素，开始监视它们
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(el => observer.observe(el));
});

// --- 调整特定视频的播放速度 ---
document.addEventListener('DOMContentLoaded', () => {
    // 找到对应区域（cinematic-videos）里的所有视频
    const cinematicVideos = document.querySelectorAll('.cinematic-videos video');
    
    cinematicVideos.forEach(video => {
        // 1.0 是原速，0.5 是慢放一半，你可以自己修改这个数字来调到你满意的速度
        video.playbackRate = 0.5; 
    });
});