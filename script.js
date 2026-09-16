
document.addEventListener('DOMContentLoaded', () => {

    const loadingDuration = 3500;

    setTimeout(() => {

        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 1000);


        const video1 = document.getElementById('loading-video');
        const video2 = document.getElementById('main-video');
        video1.style.opacity = '0';
        video2.style.opacity = '1';
        video2.play();


        const heroContent = document.getElementById('hero-content');
        heroContent.style.opacity = '1';
        heroContent.style.pointerEvents = 'auto';


        const fadeItems = document.querySelectorAll('.fade-item');
        fadeItems.forEach((item, index) => {

            setTimeout(() => {
                item.classList.add('show');
            }, index * 200);
        });

    }, loadingDuration);
});


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


function showGallery() {
    const heroSection = document.querySelector('.hero');
    const gallerySection = document.getElementById('gallery-section');

    heroSection.style.display = 'none';
    gallerySection.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


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




document.addEventListener('DOMContentLoaded', () => {

    const filterBtns = document.querySelectorAll('.city-filters span');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const musicPlayer = document.getElementById('bg-music');
    const musicToggleBtn = document.getElementById('music-toggle');
    const customCursor = document.getElementById('custom-cursor');


    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {

            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');


            const selectedCategory = this.getAttribute('data-filter');
            galleryItems.forEach(item => {
                if (selectedCategory === '全部' || item.getAttribute('data-category') === selectedCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });


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


    galleryItems.forEach(item => {

        item.addEventListener('click', function () {
            const imgSrc = this.querySelector('img').src;
            const title = this.querySelector('.item-title').innerText;
            const location = this.querySelector('.item-location').innerText;
            const camera = this.querySelector('.item-camera').innerText;

            openDetail(imgSrc, title, location, camera);
        });
    });


    if (customCursor) {

        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });


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
});


if (customCursor) {
    let mouseX = 0;
    let mouseY = 0;
    let isScheduled = false;


    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;


        if (!isScheduled) {

            requestAnimationFrame(() => {
                customCursor.style.left = mouseX + 'px';
                customCursor.style.top = mouseY + 'px';
                isScheduled = false;
            });
            isScheduled = true;
        }
    });


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




function changeEditorialContent(element, imgSrc, caption, num, quote, author) {

    document.getElementById('editorial-main-img').src = imgSrc;
    document.getElementById('editorial-caption').innerText = caption;


    document.getElementById('editorial-num').innerText = num;

    document.getElementById('editorial-quote').innerHTML = quote;


    const thumbs = document.querySelectorAll('.ed-thumb');
    thumbs.forEach(thumb => {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                entry.target.classList.add('active');


            }
        });
    }, observerOptions);


    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(el => observer.observe(el));
});


document.addEventListener('DOMContentLoaded', () => {

    const cinematicVideos = document.querySelectorAll('.cinematic-videos video');

    cinematicVideos.forEach(video => {

        video.playbackRate = 0.5;
    });
});