// 页面导航和过渡动画处理
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
});

function initializeNavigation() {
    // 获取所有内部导航链接
    const internalLinks = document.querySelectorAll('a[href^="index.html"], a[href^="about.html"], a[href^="ai_qa.html"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', handleInternalNavigation);
    });
}

function handleInternalNavigation(event) {
    // 阻止默认链接行为
    event.preventDefault();
    
    const targetUrl = event.target.getAttribute('href');
    
    // 如果是当前页面，不进行跳转
    if (isCurrentPage(targetUrl)) {
        return;
    }
    
    // 显示过渡动画并跳转
    showTransitionAndNavigate(targetUrl);
}

function isCurrentPage(targetUrl) {
    const currentPage = getCurrentPageName();
    const targetPage = targetUrl.split('.')[0];
    return currentPage === targetPage || (currentPage === 'index' && targetPage === 'index');
}

function showTransitionAndNavigate(targetUrl) {
    const glitchOverlay = document.getElementById('glitchOverlay');
    
    if (!glitchOverlay) {
        // 如果没有过渡动画元素，直接跳转
        window.location.href = targetUrl;
        return;
    }
    
    // 显示Glitch过渡动画
    glitchOverlay.style.display = 'flex';
    
    // 动画持续时间后跳转到目标页面
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 300); // 0.3秒过渡时间
}

// 页面加载完成后隐藏过渡动画
function hideGlitchOverlay() {
    const glitchOverlay = document.getElementById('glitchOverlay');
    if (glitchOverlay) {
        // 延迟隐藏，让用户看到加载完成
        setTimeout(() => {
            glitchOverlay.style.display = 'none';
        }, 150);
    }
}

// 创建Glitch过渡动画元素（如果页面中没有）
function createGlitchOverlay() {
    if (document.getElementById('glitchOverlay')) {
        return; // 已存在
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'glitchOverlay';
    overlay.className = 'glitch-overlay';
    
    const glitchText = document.createElement('div');
    glitchText.className = 'glitch-text';
    glitchText.textContent = 'LOADING...';
    
    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    
    overlay.appendChild(glitchText);
    overlay.appendChild(loadingBar);
    
    document.body.appendChild(overlay);
}

// 获取当前页面名称的辅助函数
function getCurrentPageName() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop().split('.')[0];
    return fileName || 'index';
}

// 页面加载时执行
window.addEventListener('load', function() {
    hideGlitchOverlay();
});

// 返回上一页功能
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

// 导出函数供其他模块使用
window.NavigationUtils = {
    showTransitionAndNavigate,
    hideGlitchOverlay,
    createGlitchOverlay,
    goBack
}; 