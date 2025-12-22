// 时钟功能
let clockInterval = null;
let countdownInterval = null;

function toggleClock() {
    const clockModal = document.getElementById('clockModal');
    const idleBtnTop = document.getElementById('idleBtnTop');
    
    if (clockModal.style.display === 'block') {
        // 关闭时钟
        clockModal.style.display = 'none';
        clearInterval(clockInterval);
        clearInterval(countdownInterval);
        idleBtnTop.classList.remove('active');
        idleBtnTop.innerHTML = '<i class="fa fa-gamepad"></i> 挂机';
    } else {
        // 打开时钟
        clockModal.style.display = 'block';
        idleBtnTop.classList.add('active');
        idleBtnTop.innerHTML = '<i class="fa fa-gamepad"></i> 挂机中';
        
        // 初始化时钟
        setAutoMode();
        getTime();
        clockInterval = setInterval(getTime, 1000);
        
        // 每小时检查一次模式
        setInterval(setAutoMode, 60 * 60 * 1000);
    }
}

function getTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var day = ('0' + now.getDate()).slice(-2);
    var hours = ('0' + now.getHours()).slice(-2);
    var minutes = ('0' + now.getMinutes()).slice(-2);
    var seconds = ('0' + now.getSeconds()).slice(-2);
    
    var element = document.getElementById('clockTime');
    
    var str = "今天是星期";
    var week = now.getDay();
    var weekStr = ["日", "一", "二", "三", "四", "五", "六"][week];
    str += weekStr;
    
    element.innerHTML = '<h3>' + year + '-' + month + '-' + day + '</h3>' + 
        '<h1>' + hours + ':' + minutes + ':' + seconds + '</h1>' + 
        '<p>' + str + '</p>';
}

function setDayMode() {
    const clockContent = document.querySelector('.clock-content');
    clockContent.style.backgroundColor = 'white';
    clockContent.style.color = 'black';
    clockContent.classList.remove('night-mode');
}

function setNightMode() {
    const clockContent = document.querySelector('.clock-content');
    clockContent.style.backgroundColor = '#1a1a1a';
    clockContent.style.color = 'white';
    clockContent.classList.add('night-mode');
}

function setAutoMode() {
    var now = new Date();
    var hours = now.getHours();
    if (hours > 18 || hours < 6) {
        setNightMode();
    } else {
        setDayMode();
    }
}

function countdownOneminute() {
    const countdownDisplay = document.getElementById('countdownDisplay');
    let seconds = 60;
    
    // 清除之前的倒计时
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownDisplay.textContent = `倒计时: ${seconds}秒`;
    
    countdownInterval = setInterval(function() {
        seconds--;
        if (seconds >= 0) {
            countdownDisplay.textContent = `倒计时: ${seconds}秒`;
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = "倒计时结束！";
            alert("倒计时结束！");
        }
    }, 1000);
}

// 主要功能整合文件
document.addEventListener('DOMContentLoaded', function() {
    // 初始化用户数据
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // 获取DOM元素
    const authButtons = document.querySelector('.auth-buttons');
    const userCenter = document.getElementById('userCenter');
    const userName = document.getElementById('userName');
    const userLevel = document.getElementById('userLevel');
    const userExp = document.getElementById('userExp');
    const expProgress = document.getElementById('expProgress');
    const logoutBtn = document.getElementById('logoutBtn');
    const checkinTop = document.getElementById('checkinTop');
    const checkinBtnTop = document.getElementById('checkinBtnTop');

    // 搜索相关元素
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    const searchFrame = document.getElementById('searchFrame');
    const closeSearch = document.getElementById('closeSearch');

    // 轮播图相关元素
    const carouselItems = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // 登录表单处理
    const loginForm = document.querySelector('.login-form form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 注册表单处理
    const registerForm = document.querySelector('.register-form form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // 初始化用户经验数据
    function initializeUserExpData(userId) {
        let userExpData = JSON.parse(localStorage.getItem('userExpData')) || {};

        // 如果用户没有经验值数据，初始化
        if (!userExpData[userId]) {
            userExpData[userId] = {
                exp: 0,
                level: 1,
                lastCheckin: null
            };
            localStorage.setItem('userExpData', JSON.stringify(userExpData));
        }

        return userExpData;
    }

    // 检查登录状态
    function checkLoginStatus() {
        const user = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));

        if (user) {
            // 用户已登录，显示用户中心
            if (authButtons) authButtons.style.display = 'none';
            if (userCenter) {
                userCenter.style.display = 'flex';
                userName.textContent = user.username;

                // 获取用户经验值数据
                getUserExpData(user.id);

                // 显示签到按钮
                if (checkinTop) checkinTop.style.display = 'block';

                // 检查今日是否已签到
                checkTodayCheckin(user.id);
            }

            // 更新其他页面的用户信息UI
            updateUIForLoggedInUser(user);
        } else {
            // 用户未登录，显示登录注册按钮
            if (authButtons) authButtons.style.display = 'flex';
            if (userCenter) userCenter.style.display = 'none';

            // 隐藏签到按钮
            if (checkinTop) {
                checkinTop.style.display = 'none';
                // 重置签到按钮状态
                if (checkinBtnTop) {
                    checkinBtnTop.disabled = false;
                    checkinBtnTop.innerHTML = '<i class="fa fa-calendar-check"></i> 签到';
                }
            }
        }
    }

    // 获取用户经验值数据
    function getUserExpData(userId) {
        const userExpData = initializeUserExpData(userId);
        // 更新UI
        updateExpUI(userExpData[userId]);
    }

    // 更新经验值UI
    function updateExpUI(expData) {
        if (!userLevel || !userExp || !expProgress) return;

        const { exp, level } = expData;

        // 计算当前等级所需经验值
        const expNeeded = level * 100;
        const expProgressPercent = (exp % expNeeded) / expNeeded * 100;

        // 更新UI
        userLevel.textContent = level;
        userExp.textContent = exp;
        expProgress.style.width = expProgressPercent + '%';
    }

    // 检查今日是否已签到
    function checkTodayCheckin(userId) {
        if (!checkinBtnTop) return;

        let userExpData = JSON.parse(localStorage.getItem('userExpData')) || {};
        const lastCheckin = userExpData[userId]?.lastCheckin;

        if (lastCheckin) {
            const lastCheckinDate = new Date(lastCheckin).setHours(0, 0, 0, 0);
            const today = new Date().setHours(0, 0, 0, 0);

            if (lastCheckinDate === today) {
                // 今日已签到
                checkinBtnTop.disabled = true;
                checkinBtnTop.innerHTML = '<i class="fa fa-calendar-check"></i> 已签到';
            }
        }
    }

    // 签到功能
    if (checkinBtnTop) {
        checkinBtnTop.addEventListener('click', function() {
            const user = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));

            if (!user) return;

            // 初始化或获取用户经验数据
            let userExpData = initializeUserExpData(user.id);

            // 添加经验值
            const expGained = Math.floor(Math.random() * 20) + 10; // 随机获得10-30经验值
            userExpData[user.id].exp += expGained;

            // 检查是否升级
            const expNeeded = userExpData[user.id].level * 100;
            if (userExpData[user.id].exp >= expNeeded) {
                userExpData[user.id].level += 1;
                alert(`签到成功！获得${expGained}经验值，恭喜升级到Lv.${userExpData[user.id].level}！`);
            } else {
                alert(`签到成功！获得${expGained}经验值！`);
            }

            // 更新签到日期
            userExpData[user.id].lastCheckin = new Date().toISOString();

            // 保存数据
            localStorage.setItem('userExpData', JSON.stringify(userExpData));

            // 更新UI
            updateExpUI(userExpData[user.id]);
            checkinBtnTop.disabled = true;
            checkinBtnTop.innerHTML = '<i class="fa fa-calendar-check"></i> 已签到';
        });
    }

    // 处理登录
    function handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;

        // 验证用户
        const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

        if (user) {
            // 登录成功
            alert('登录成功！');

            // 保存登录状态
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }

            // 跳转到主页
            window.location.href = 'index.html';
        } else {
            // 登录失败
            showError('用户名或密码错误');
        }
    }

    // 处理注册
    function handleRegister(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // 验证输入
        if (password !== confirmPassword) {
            showError('两次输入的密码不一致');
            return;
        }

        // 检查用户名是否已存在
        if (users.some(u => u.username === username)) {
            showError('用户名已存在');
            return;
        }

        // 检查邮箱是否已存在
        if (users.some(u => u.email === email)) {
            showError('该邮箱已被注册');
            return;
        }

        // 创建新用户
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        // 保存用户
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // 注册成功，自动登录
        alert('注册成功！正在为您自动登录...');

        // 自动登录用户
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // 跳转到主页
        window.location.href = 'index.html';
    }

    // 显示错误信息
    function showError(message) {
        // 创建或更新错误提示元素
        let errorElement = document.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';

            // 添加到表单前面
            const form = document.querySelector('form');
            form.parentNode.insertBefore(errorElement, form);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // 3秒后自动隐藏
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }

    // 更新已登录用户的UI
    function updateUIForLoggedInUser(user) {
        // 查找登录和注册按钮
        const authButtons = document.querySelector('.auth-buttons');

        if (authButtons) {
            // 替换为用户信息（不含退出按钮）
            authButtons.innerHTML = `
                <div class="user-info">
                    <span>欢迎，${user.username}</span>
                </div>
            `;
        }
    }

    // 退出登录功能
    function handleLogout() {
        // 移除用户登录信息
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');

        // 重置签到按钮状态
        if (checkinBtnTop) {
            checkinBtnTop.disabled = false;
            checkinBtnTop.innerHTML = '<i class="fa fa-calendar-check"></i> 签到';
        }

        // 更新UI状态
        checkLoginStatus();

        // 如果在登录或注册页面，不需要刷新
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
            return;
        }

        // 其他页面刷新以确保UI更新
        window.location.reload();
    }

    // 为退出按钮添加点击事件
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // 为所有可能的退出按钮添加事件（包括动态创建的）
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('logout-btn')) {
            e.preventDefault();
            handleLogout();
        }
    });

    // ========== 搜索功能 ==========

    // 搜索按钮点击事件
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // 搜索框回车事件
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }

    // 关闭搜索结果
    if (closeSearch) {
        closeSearch.addEventListener('click', function() {
            searchResults.style.display = 'none';
            searchInput.value = '';
        });
    }

    // 执行搜索的函数
    function performSearch() {
        const searchTerm = searchInput.value.trim();

        if (searchTerm === '') {
            return;
        }

        // 构建搜索URL
        const searchUrl = `https://bangumi.tv/subject_search/${encodeURIComponent(searchTerm)}?cat=all`;

        // 设置iframe的src
        searchFrame.src = searchUrl;

        // 显示搜索结果
        searchResults.style.display = 'flex';
    }

    // ========== 轮播图功能 ==========

    // 当前显示的轮播图索引
    let currentIndex = 0;

    // 如果存在轮播图元素，初始化轮播图功能
    if (carouselItems.length > 0) {
        // 轮播图切换函数
        function showSlide(index) {
            // 隐藏所有轮播图
            carouselItems.forEach(item => {
                item.classList.remove('active');
            });

            // 移除所有指示器的活动状态
            indicators.forEach(indicator => {
                indicator.classList.remove('active');
            });

            // 显示当前轮播图
            carouselItems[index].classList.add('active');
            indicators[index].classList.add('active');

            // 更新当前索引
            currentIndex = index;
        }

        // 下一张轮播图
        function nextSlide() {
            const newIndex = (currentIndex + 1) % carouselItems.length;
            showSlide(newIndex);
        }

        // 上一张轮播图
        function prevSlide() {
            const newIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
            showSlide(newIndex);
        }

        // 添加按钮点击事件
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // 添加指示器点击事件
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
            });
        });

        // 自动轮播
        let intervalId = setInterval(nextSlide, 5000);

        // 鼠标悬停时暂停自动轮播
        const carousel = document.querySelector('.carousel-container');

        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(intervalId);
            });

            carousel.addEventListener('mouseleave', () => {
                intervalId = setInterval(nextSlide, 5000);
            });

            // 触摸滑动支持
            let touchStartX = 0;
            let touchEndX = 0;

            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });

            function handleSwipe() {
                // 向左滑动，显示下一张
                if (touchEndX < touchStartX - 50) {
                    nextSlide();
                }

                // 向右滑动，显示上一张
                if (touchEndX > touchStartX + 50) {
                    prevSlide();
                }
            }
        }
    }

    // 页面加载时检查登录状态
    checkLoginStatus();


});


