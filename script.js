// OpenClaw 知识中心 - 交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 搜索功能
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) return;
            
            // 简单搜索实现
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const text = section.textContent.toLowerCase();
                if (text.includes(query)) {
                    section.style.display = 'block';
                } else {
                    // 隐藏不相关的 section，但保持关键导航
                    if (section.id !== 'what-is' && section.id !== 'stats') {
                        section.style.display = 'none';
                    }
                }
            });
            
            // 显示搜索结果提示
            if (query.length > 0) {
                showSearchResults(query);
            } else {
                hideSearchResults();
            }
        });
        
        searchBox.addEventListener('blur', function() {
            setTimeout(() => {
                resetDisplay();
            }, 300);
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 卡片悬停效果
    document.querySelectorAll('.card, .tutorial-card, .tool-card, .scenario, .tip-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 导航高亮
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.background = '';
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.background = 'var(--primary)';
                link.style.color = 'white';
            }
        });
    });
    
    // 统计数字动画
    animateNumbers();
    
    // 加载提示
    console.log('🦞 OpenClaw 知识中心已加载');
});

function showSearchResults(query) {
    let resultsPanel = document.getElementById('search-results');
    if (!resultsPanel) {
        resultsPanel = document.createElement('div');
        resultsPanel.id = 'search-results';
        resultsPanel.style.cssText = `
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 600px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            padding: 20px;
            z-index: 1000;
            max-height: 400px;
            overflow-y: auto;
        `;
        document.querySelector('.header-actions').appendChild(resultsPanel);
    }
    
    // 模拟搜索结果
    const results = [
        { title: '安装 OpenClaw', section: 'getting-started', desc: '5分钟快速安装指南' },
        { title: '连接飞书渠道', section: 'tools', desc: '飞书机器人配置' },
        { title: '技能商店', section: 'skills', desc: '5000+ 社区技能' },
        { title: '定时任务', section: 'tips', desc: 'Cron Jobs 配置' },
        { title: '远程访问', section: 'tips', desc: 'Tailscale 教程' },
    ].filter(r => r.title.toLowerCase().includes(query) || r.desc.toLowerCase().includes(query));
    
    if (results.length > 0) {
        resultsPanel.innerHTML = `
            <h4 style="margin-bottom: 15px; color: var(--secondary);">搜索结果：</h4>
            ${results.map(r => `
                <a href="#${r.section}" style="display: block; padding: 12px; text-decoration: none; color: var(--text); border-bottom: 1px solid #eee;">
                    <strong>${r.title}</strong>
                    <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 5px;">${r.desc}</p>
                </a>
            `).join('')}
        `;
        resultsPanel.style.display = 'block';
    } else {
        resultsPanel.innerHTML = '<p style="text-align: center; color: var(--text-light);">未找到相关内容</p>';
        resultsPanel.style.display = 'block';
    }
}

function hideSearchResults() {
    const resultsPanel = document.getElementById('search-results');
    if (resultsPanel) {
        resultsPanel.style.display = 'none';
    }
}

function resetDisplay() {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'block';
    });
    hideSearchResults();
}

function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    numbers.forEach(num => {
        const target = num.textContent;
        if (!isNaN(target) || target.includes('+')) {
            // 数字动画效果
            let current = 0;
            const max = parseInt(target.replace(/\D/g, '')) || 100;
            const increment = max / 30;
            const isPercent = target.includes('%');
            const isPlus = target.includes('+');
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= max) {
                    current = max;
                    clearInterval(timer);
                }
                num.textContent = Math.floor(current) + (isPlus ? '+' : '') + (isPercent ? '%' : '');
            }, 30);
        }
    });
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 聚焦搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-box').focus();
    }
    
    // Escape 关闭搜索结果
    if (e.key === 'Escape') {
        resetDisplay();
        document.getElementById('search-box').blur();
    }
});

// 复制提示词功能
function copyPrompt(promptId) {
    const promptText = document.getElementById(promptId).textContent;
    navigator.clipboard.writeText(promptText).then(function() {
        // 显示复制成功提示
        showCopySuccess();
    }).catch(function(err) {
        console.error('复制失败:', err);
        // 备用方案：使用selection API
        const range = document.createRange();
        range.selectNode(document.getElementById(promptId));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        showCopySuccess();
    });
}

// 场景卡片点击展开/收起
document.addEventListener('DOMContentLoaded', function() {
    // 为每个场景卡片添加点击事件
    document.querySelectorAll('.scenario').forEach(function(scenario) {
        scenario.addEventListener('click', function(e) {
            // 如果点击的是复制按钮，不触发展开/收起
            if (e.target.classList.contains('copy-btn')) {
                return;
            }
            
            // 切换 active 状态
            this.classList.toggle('active');
            
            // 滚动到视图内（如果是展开）
            if (this.classList.contains('active')) {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });
});

function showCopySuccess() {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 128, 0, 0.9);
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        font-size: 1.2rem;
        z-index: 10000;
        animation: fadeInOut 1.5s ease;
    `;
    toast.textContent = '✅ 已复制到剪贴板！';
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);
    
    // 1.5秒后移除
    setTimeout(() => {
        toast.remove();
        style.remove();
    }, 1500);
}
