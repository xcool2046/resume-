// 主入口文件 - 处理页面加载和初始化
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载完成后的初始化
    initializePage();
    
    // 设置当前页面的活动导航状态
    setActiveNavigation();
    
    // 隐藏加载动画（如果存在）
    hideLoadingAnimation();
});

function initializePage() {
    // 获取当前页面名称
    const currentPage = getCurrentPageName();
    console.log(`当前页面: ${currentPage}`);
    
    // 根据不同页面执行特定初始化
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'about':
            initializeAboutPage();
            break;
        case 'ai_qa':
            initializeAIPage();
            break;
        default:
            console.log('未知页面');
    }
}

function getCurrentPageName() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop().split('.')[0];
    return fileName || 'index';
}

function setActiveNavigation() {
    const currentPage = getCurrentPageName();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        const linkPage = href.split('/').pop().split('.')[0];
        
        if (linkPage === currentPage || (currentPage === 'index' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function hideLoadingAnimation() {
    const glitchOverlay = document.getElementById('glitchOverlay');
    if (glitchOverlay) {
        setTimeout(() => {
            glitchOverlay.style.display = 'none';
        }, 100);
    }
}

// 页面特定初始化函数
function initializeHomePage() {
    console.log('初始化首页');
    // 首页特定的初始化逻辑可以在这里添加
}

function initializeAboutPage() {
    console.log('初始化关于页面');
    // 关于页面特定的初始化逻辑
}

function initializeAIPage() {
    console.log('初始化AI问答页面');
    // AI页面特定的初始化逻辑
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 确保所有资源加载完成
window.addEventListener('load', function() {
    console.log('所有资源加载完成');
}); 