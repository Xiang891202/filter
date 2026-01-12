// product.js - 商品展示逻辑
console.log("product.js 已加载");


// 當前顯示的商品詳細信息ID
let currentDetailProductId = null;

// 渲染商品列表
function renderProductList(filteredProducts = window.products || []) {
  const productSection = document.getElementById("product-section");
  
  if (!productSection) {
    console.error("找不到 #product-section 元素");
    return false;
  }
  
  // 如果 products 是空數組，檢查是否有數據
  if (!filteredProducts || filteredProducts.length === 0) {
    productSection.innerHTML = `
      <div class="no-products">
        <h3>找不到符合條件的商品</h3>
        <p>請嘗試調整篩選條件</p>
      </div>
    `;
    return true;
  }
  
  console.log(`正在渲染 ${filteredProducts.length} 個商品`);
  
  productSection.innerHTML = `
    <div class="products-header">
      <h2>商品列表</h2>
      <div class="product-count">找到 ${filteredProducts.length} 個商品</div>
    </div>
    <div class="products-grid">
      ${filteredProducts.map(product => renderProductCard(product)).join('')}
    </div>
  `;
  
  // 添加点击事件
  addProductCardEvents();
  return true;
}

// 渲染单个商品卡片
function renderProductCard(product) {
  if (!product) return '';
  
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-left">
        <img src="${product.image || 'https://via.placeholder.com/300x200'}" 
             alt="${product.name}" 
             class="product-image">
        <div class="product-tag">${product.area || '台北市'}</div>
      </div>
      <div class="product-right">
        <div class="product-header">
          <h3 class="product-name">${product.name || '未命名商品'}</h3>
          <div class="product-price">${formatPrice(product.price || 0)} 萬</div>
        </div>
        <div class="product-details">
          <div class="detail-item">
            <span class="detail-label">單價</span>
            <span class="detail-value">${product.unitPrice || 0} 萬/坪</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">權狀</span>
            <span class="detail-value">${product.size || 0} 坪</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">格局</span>
            <span class="detail-value">${product.layout || '未指定'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">屋齡</span>
            <span class="detail-value">約 ${product.age || 0} 年</span>
          </div>
        </div>
        <p class="product-description">${product.description || '暫無描述'}</p>
        <button class="product-detail-btn" data-product-id="${product.id}">查看詳情</button>
      </div>
    </div>
  `;
}

// 格式化价格显示
function formatPrice(price) {
  return price.toLocaleString('zh-TW');
}

// 添加商品卡片事件
function addProductCardEvents() {
  // 商品卡片点击事件
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.classList.contains('product-detail-btn') || 
          e.target.tagName === 'BUTTON') {
        return;
      }
      const productId = this.dataset.productId;
      if (productId) {
        showProductDetail(productId);
      }
    });
  });
  
  // 查看详情按钮点击事件
  const detailButtons = document.querySelectorAll('.product-detail-btn');
  detailButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const productId = this.dataset.productId;
      if (productId) {
        showProductDetail(productId);
      }
    });
  });
}

// 显示商品详情页面
function showProductDetail(productId) {
  const product = window.products.find(p => p.id === parseInt(productId));
  
  if (!product) {
    alert('找不到商品資訊');
    return;
  }
  
  currentDetailProductId = productId;
  
  // 隐藏主内容（篩選器 + 商品列表），显示详细页面
  const mainContent = document.getElementById("main-content");
  const detailSection = document.getElementById("product-detail-section");
  
  if (mainContent) mainContent.style.display = 'none';
  
  // 渲染详细页面
  renderProductDetailPage(product);
  
  if (detailSection) {
    detailSection.style.display = 'block';
    // 添加淡入效果
    setTimeout(() => {
      detailSection.classList.add('active');
    }, 10);
  }
  
  // 更新浏览器URL（但不刷新页面）
  updateURL(productId);
  
  // 更新页面标题
  document.title = `${product.name} | 房屋篩選系統`;
  
  // 添加返回按钮事件
  setTimeout(() => {
    const backBtn = document.querySelector('.detail-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', backToProductList);
    }
    
    // 添加详细页面其他事件
    addDetailPageEvents(product);
  }, 100);
}

// 渲染商品详细页面
function renderProductDetailPage(product) {
  const detailSection = document.getElementById("product-detail-section");
  
  if (!detailSection) return;
  
  // 生成图片数组
  const images = [
    product.image,
    product.detailImage || product.image,
    "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop"
  ];
  
  detailSection.innerHTML = `
    <!-- 返回按钮 -->
    <div class="detail-back-btn-container">
      <button class="detail-back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回商品列表
      </button>
    </div>
    
    <!-- 商品详细内容 -->
    <div class="detail-content">
      <div class="detail-images">
        <img id="detailMainImage" src="${images[0]}" alt="${product.name}" class="detail-main-image">
        <div class="detail-thumbnails">
          ${images.map((img, index) => `
            <img src="${img}" alt="${product.name} - 圖${index + 1}" 
                 class="detail-thumb" data-image-index="${index}">
          `).join('')}
        </div>
      </div>
      
      <div class="detail-info">
        <div class="detail-header">
          <div>
            <h1 class="detail-title">${product.name}</h1>
            <div class="detail-tag">${product.area}</div>
          </div>
          <div class="detail-price">${formatPrice(product.price)} 萬</div>
        </div>
        
        <div class="detail-specs">
          <div class="spec-item">
            <span class="spec-label">單價</span>
            <span class="spec-value">${product.unitPrice} 萬/坪</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">權狀面積</span>
            <span class="spec-value">${product.size} 坪</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">主建物</span>
            <span class="spec-value">${(product.size * 0.7).toFixed(1)} 坪</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">格局</span>
            <span class="spec-value">${product.layout}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">屋齡</span>
            <span class="spec-value">約 ${product.age} 年</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">樓層</span>
            <span class="spec-value">${Math.floor(Math.random() * 15) + 3} / ${Math.floor(Math.random() * 15) + 15}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">朝向</span>
            <span class="spec-value">${['朝南', '朝北', '朝東', '朝西'][Math.floor(Math.random() * 4)]}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">建築類型</span>
            <span class="spec-value">${['公寓', '電梯大樓', '透天厝'][Math.floor(Math.random() * 3)]}</span>
          </div>
        </div>
        
        <div class="detail-description">
          <h3>房屋描述</h3>
          <p>${product.description}</p>
        </div>
        
        <div class="detail-features">
          <h3>房屋特色</h3>
          <ul class="features-list">
            <li>近捷運站，交通便利</li>
            <li>學區優良，生活機能完善</li>
            <li>社區管理良好，安全性高</li>
            <li>採光通風良好，視野開闊</li>
            <li>裝潢精緻，可直接入住</li>
            <li>鄰近公園，休閒空間充足</li>
          </ul>
        </div>
        
        <div class="detail-actions">
          <button class="action-btn btn-contact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg>
            聯絡房仲
          </button>
          <button class="action-btn btn-favorite" data-product-id="${product.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            加入收藏
          </button>
          <button class="action-btn btn-share">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
            </svg>
            分享
          </button>
        </div>
      </div>
    </div>
  `;
}

// 返回商品列表
function backToProductList() {
  const mainContent = document.getElementById("main-content");
  const detailSection = document.getElementById("product-detail-section");
  
  // 淡出效果
  if (detailSection) {
    detailSection.classList.remove('active');
    
    // 等待淡出動畫完成後隱藏
    setTimeout(() => {
      detailSection.style.display = 'none';
      if (mainContent) {
        mainContent.style.display = 'block';
      }
      
      // 清除URL中的商品ID
      updateURL(null);
      
      // 恢復頁面標題
      document.title = "房屋篩選系統 | 商品展示";
    }, 300);
  }
}

// 更新URL（歷史記錄）
function updateURL(productId) {
  const url = new URL(window.location);
  
  if (productId) {
    url.searchParams.set('product', productId);
  } else {
    url.searchParams.delete('product');
  }
  
  // 更新URL但不重新載入頁面
  window.history.pushState({ productId }, '', url);
}

// 添加详细页面事件
function addDetailPageEvents(product) {
  // 缩略图点击事件
  const thumbnails = document.querySelectorAll('.detail-thumb');
  const mainImage = document.getElementById('detailMainImage');
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
      mainImage.src = this.src;
      
      // 更新当前选中的缩略图
      thumbnails.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // 默认选中第一个缩略图
  if (thumbnails.length > 0) {
    thumbnails[0].classList.add('active');
  }
  
  // 联络按钮事件
  const contactBtn = document.querySelector('.btn-contact');
  if (contactBtn) {
    contactBtn.addEventListener('click', function() {
      alert(`將為您聯絡 ${product.area} 的房仲人員\n電話：02-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`);
    });
  }
  
  // 收藏按钮事件
  const favoriteBtn = document.querySelector('.btn-favorite');
  if (favoriteBtn) {
    // 检查本地存储中是否已收藏
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorite = favorites.includes(product.id);
    
    if (isFavorite) {
      updateFavoriteButton(favoriteBtn, true);
    }
    
    favoriteBtn.addEventListener('click', function() {
      toggleFavorite(product.id);
    });
  }
  
  // 分享按钮事件
  const shareBtn = document.querySelector('.btn-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      shareProduct(product);
    });
  }
}

// 更新收藏按钮状态
function updateFavoriteButton(button, isFavorite) {
  if (isFavorite) {
    button.classList.add('active');
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="#ff5a5f" stroke="#ff5a5f" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
      已收藏
    `;
  } else {
    button.classList.remove('active');
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
      加入收藏
    `;
  }
}

// 切换收藏状态
function toggleFavorite(productId) {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const isFavorite = favorites.includes(productId);
  const favoriteBtn = document.querySelector(`.btn-favorite[data-product-id="${productId}"]`);
  
  if (isFavorite) {
    // 移除收藏
    favorites = favorites.filter(id => id !== productId);
    updateFavoriteButton(favoriteBtn, false);
    alert('已取消收藏');
  } else {
    // 加入收藏
    favorites.push(productId);
    updateFavoriteButton(favoriteBtn, true);
    alert('已加入收藏');
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// 分享商品
function shareProduct(product) {
  const shareText = `${product.name} - ${product.price.toLocaleString()}萬 - ${product.area}`;
  const shareUrl = window.location.origin + window.location.pathname + `?product=${product.id}`;
  
  if (navigator.share) {
    // 使用 Web Share API
    navigator.share({
      title: product.name,
      text: shareText,
      url: shareUrl
    });
  } else {
    // 複製連結到剪貼板
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert('連結已複製到剪貼板！'))
      .catch(() => alert('分享功能暫不可用'));
  }
}

// 初始化函数
function initProductDisplay() {
  console.log("初始化商品顯示");
  
  // 檢查 products 變數是否已定義
  if (typeof window.products === 'undefined' || !window.products || window.products.length === 0) {
    console.error("products 變數未定義或為空！");
    const productSection = document.getElementById("product-section");
    if (productSection) {
      productSection.innerHTML = `
        <div class="no-products">
          <h3>商品數據加載失敗</h3>
          <p>請刷新頁面或檢查控制台錯誤</p>
        </div>
      `;
    }
    return false;
  }
  
  console.log(`找到 ${window.products.length} 個商品`);
  
  // 渲染商品列表
  const success = renderProductList(window.products);
  
  if (success) {
    console.log("商品列表渲染成功");
  } else {
    console.error("商品列表渲染失敗");
  }
  
  // 檢查URL中是否有商品ID參數
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');
  
  if (productId) {
    // 延遲加載詳細頁面，確保DOM已完全渲染
    setTimeout(() => {
      showProductDetail(productId);
    }, 500);
  }
  
  return success;
}

// 瀏覽器返回/前進按鈕處理
window.addEventListener('popstate', function(event) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');
  
  if (productId && productId !== currentDetailProductId) {
    showProductDetail(productId);
  } else if (!productId && currentDetailProductId) {
    backToProductList();
  }
});

// DOM 加載完成後初始化
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM 加載完成，等待篩選器渲染...");
  
  // 等待篩選器渲染完成後再渲染商品
  setTimeout(() => {
    console.log("開始初始化商品顯示");
    initProductDisplay();
  }, 500);
});

// 在 product.js 的 DOMContentLoaded 事件中，添加移動設備優化
document.addEventListener('DOMContentLoaded', function() {
  // 檢查是否是移動設備
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    console.log("移動設備優化商品卡片觸摸體驗");
    
    // 為商品卡片添加觸摸反饋
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.addEventListener('touchstart', function() {
        this.classList.add('card-touch-active');
      });
      
      card.addEventListener('touchend', function() {
        setTimeout(() => {
          this.classList.remove('card-touch-active');
        }, 200);
      });
      
      card.addEventListener('touchcancel', function() {
        this.classList.remove('card-touch-active');
      });
    });
    
    // 為按鈕添加觸摸反饋
    const buttons = document.querySelectorAll('.product-detail-btn, .action-btn, .detail-back-btn');
    buttons.forEach(btn => {
      btn.addEventListener('touchstart', function() {
        this.classList.add('btn-touch-active');
      });
      
      btn.addEventListener('touchend', function() {
        setTimeout(() => {
          this.classList.remove('btn-touch-active');
        }, 200);
      });
    });
  }
  
  // 添加移動設備詳細頁面滾動鎖定
  function lockBodyScroll(lock) {
    if (lock) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }
  
  // 修改詳細頁面顯示/隱藏時的滾動控制
  const originalShowProductDetail = window.showProductDetail;
  window.showProductDetail = function(productId) {
    originalShowProductDetail(productId);
    lockBodyScroll(true);
  };
  
  const originalBackToProductList = window.backToProductList;
  window.backToProductList = function() {
    lockBodyScroll(false);
    originalBackToProductList();
  };
});

// 在CSS中添加移動設備觸摸樣式
const mobileProductStyles = `
.product-card.card-touch-active {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-detail-btn.btn-touch-active,
.action-btn.btn-touch-active,
.detail-back-btn.btn-touch-active {
  transform: scale(0.95);
  opacity: 0.9;
}

/* 防止移動設備上的文字選擇 */
.product-card,
.filter-tab,
.location-option,
.price-option,
.shape-option,
.layout-option,
.square-option,
.more-option,
.product-detail-btn,
.action-btn,
.detail-back-btn,
.reset-btn {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
}

.product-card:active,
.filter-tab:active,
.location-option:active,
.price-option:active,
.shape-option:active,
.layout-option:active,
.square-option:active,
.more-option:active,
.product-detail-btn:active,
.action-btn:active,
.detail-back-btn:active,
.reset-btn:active {
  -webkit-tap-highlight-color: rgba(255, 90, 95, 0.1);
}
`;

// 動態添加移動設備樣式
const mobileStyleSheet = document.createElement('style');
mobileStyleSheet.textContent = mobileProductStyles;
document.head.appendChild(mobileStyleSheet);