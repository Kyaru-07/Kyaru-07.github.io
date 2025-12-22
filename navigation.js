// 页面导航功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('.nav a');

    // 为每个导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 移除所有链接的active类
            navLinks.forEach(navLink => navLink.classList.remove('active'));

            // 为当前点击的链接添加active类
            this.classList.add('active');

            // 获取目标ID
            const targetId = this.getAttribute('href').substring(1);

            // 隐藏所有内容区域
            const contentSections = document.querySelectorAll('.content-section, .about-section');
            contentSections.forEach(section => {
                section.style.display = 'none';
            });

            // 显示目标内容区域
            if (targetId === 'home') {
                // 显示主页内容
                const homeSection = document.querySelector('.content-section');
                if (homeSection) {
                    homeSection.style.display = 'block';
                }

                // 显示轮播图
                const carousel = document.querySelector('.carousel-container');
                if (carousel) {
                    carousel.style.display = 'block';
                }
            } else if (targetId === 'about') {
                // 隐藏轮播图
                const carousel = document.querySelector('.carousel-container');
                if (carousel) {
                    carousel.style.display = 'none';
                }

                // 显示关于部分
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    aboutSection.style.display = 'block';
                }
            }
        });
    });

    // 初始化页面，默认显示主页
    const homeLink = document.querySelector('.nav a[href="#home"]');
    if (homeLink) {
        homeLink.click();
    }
});
