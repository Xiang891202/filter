let filterStates = {}; // 記錄每個篩選器的展開狀態
let squareType = '權狀'; // 記錄權狀類型：'權狀' 或 '主建'

// 篩選狀態對象，記錄每個篩選器的選擇
let filterSelections = {
  location: [], // 位置篩選
  type: '',     // 類型篩選（單選）
  price: [],    // 價格篩選
  shape: [],    // 型態篩選
  layout: [],   // 格局篩選
  square: [],   // 權狀篩選
  more: {       // 更多篩選
    listTime: '',
    age: [],
    unitPrice: [],
    direction: '',
    floor: [],
    bathroom: [],
    decoration: [],
    living: [],
    agent: [],
    parking: []
  }
};

const filterSection = document.getElementById("filter-section");

// 渲染所有篩選器
function renderAllFilters() {
  filterSection.innerHTML = filterConfig
    .map(filterGroup => renderFilterGroup(filterGroup))
    .join("");
}

// 渲染單個篩選組
function renderFilterGroup(filterGroup) {
  const firstTab = filterGroup.tabs[0];
  const filterKey = filterGroup.key;
  
  // 初始化篩選器狀態
  filterStates[filterKey] = true;
  
  // 檢查篩選器類型
  if (filterKey === 'type') {
    // 類型篩選器：使用 filter-tab 類別，與位置篩選器一致
    return `
      <div class="filter-group" data-filter-key="${filterKey}">
        <div class="filter-header">
          <div class="filter-title">${filterGroup.title}</div>
          <div class="filter-tabs">
            ${renderTypeOptions(firstTab)}
          </div>
        </div>
      </div>
    `;
  } else if (filterKey === 'price') {
    // 售價篩選器：特殊處理，部分選項有 checkbox
    return `
      <div class="filter-group" data-filter-key="${filterKey}">
        <div class="filter-header">
          <div class="filter-title">${filterGroup.title}</div>
          <div class="filter-tabs price-tabs">
            ${renderPriceOptions(firstTab)}
          </div>
        </div>
      </div>
    `;
  } else if (filterKey === 'shape') {
    // 型態篩選器：有 checkbox，與位置篩選器相似但沒有下拉面板
    return `
      <div class="filter-group" data-filter-key="${filterKey}">
        <div class="filter-header">
          <div class="filter-title">${filterGroup.title}</div>
          <div class="filter-tabs shape-tabs">
            ${renderShapeOptions(firstTab)}
          </div>
        </div>
      </div>
    `;
  } else if (filterKey === 'layout') {
    // 格局篩選器：有 checkbox，與型態篩選器相似
    return `
      <div class="filter-group" data-filter-key="${filterKey}">
        <div class="filter-header">
          <div class="filter-title">${filterGroup.title}</div>
          <div class="filter-tabs layout-tabs">
            ${renderLayoutOptions(firstTab)}
          </div>
        </div>
      </div>
    `;
  } else if (filterKey === 'square') {
    // 權狀篩選器：特殊處理，帶有下拉框的標題
    return `
      <div class="filter-group" data-filter-key="${filterKey}">
        <div class="filter-header">
          <div class="filter-title square-dropdown-container">
            <span class="square-title-text">${squareType}</span>
            <span class="square-dropdown-arrow">▾</span>
            <div class="square-dropdown-menu">
              <div class="square-dropdown-item ${squareType === '權狀' ? 'active' : ''}" data-type="權狀">權狀</div>
              <div class="square-dropdown-item ${squareType === '主建' ? 'active' : ''}" data-type="主建">主建</div>
            </div>
          </div>
          <div class="filter-tabs square-tabs">
            ${renderSquareOptions(firstTab)}
          </div>
        </div>
      </div>
    `;
  } else if (filterKey === 'more') {
    // 更多篩選器：每個tab都有下拉框，滑鼠懸浮顯示
    return `
      <div class="filter-group" data-filter-key="${filterKey}">
          <div class="filter-header">
              <div class="filter-title">${filterGroup.title}</div>
      
              <div class="filter-tabs more-tabs">
              ${filterGroup.tabs
                  .map(
                  (tab, index) => `
                  <div class="more-tab-wrapper">
                      <button
                          class="filter-tab more-filter-tab"
                          data-tab="${tab.key}"
                          data-filter-key="${filterKey}">
                          ${tab.name} ▾
                      </button>
                      <div class="more-dropdown" data-tab="${tab.key}">
                          ${renderMoreOptions(tab)}
                      </div>
                  </div>
                  `
                  )
                  .join("")}
              </div>
          </div>
      </div>
    `;
  } else {
    // 位置篩選器：保持原結構
    return `
      <div class="filter-group" data-filter-key="${filterKey}">
          <div class="filter-header">
              <div class="filter-title">${filterGroup.title}</div>
      
              <div class="filter-tabs">
              ${filterGroup.tabs
                  .map(
                  (tab, index) => `
                  <button
                      class="filter-tab ${index === 0 ? "active" : ""}"
                      data-tab="${tab.key}"
                      data-filter-key="${filterKey}">
                      ${tab.name} ▾
                  </button>
                  `
                  )
                  .join("")}
              </div>
          </div>

        <div class="filter-panel open" data-tab="${firstTab.key}" data-filter-key="${filterKey}">
          ${renderOptions(firstTab)}
        </div>
      </div>
    `;
  }
}

// 渲染一般選項（位置篩選器用）
function renderOptions(tab) {
  return tab.options
    .map(item => {
      // 不限：沒有 checkbox
      if (item === "不限") {
        return `
          <div class="location-option unlimited active" data-value="不限">
            ${item}
          </div>
        `;
      }

      // 其他選項：有 checkbox
      return `
        <label class="location-option" data-value="${item}">
          <input type="checkbox" />
          <span>${item}</span>
        </label>
      `;
    })
    .join("");
}

// 渲染更多篩選器的下拉框選項
function renderMoreOptions(tab) {
  const isSingleSelect = ['listTime'].includes(tab.key); // 只保留刊登時間為單選
  const isRadio = ['direction'].includes(tab.key); // 朝向使用 radio
  const isAge = tab.key === 'age'; // 屋齡特殊處理
  const isFloor = tab.key === 'floor'; // 樓層特殊處理
  const isPricePerSquareMeter = tab.key === 'unitPrice'; // 單價特殊處理
  
  let optionsHTML = '';
  
  // 樓層的特殊處理：沒有"不限"選項
  if (isFloor) {
    optionsHTML = tab.options
      .map(item => {
        // 樓層選項：有 checkbox
        return `
          <label class="more-option" data-value="${item}">
            <input type="checkbox" />
            <span>${item}</span>
          </label>
        `;
      })
      .join("");
  } else {
    optionsHTML = tab.options
      .map(item => {
        const isUnlimited = item === "不限";
        
        // 修改這裡：對於 listTime（刊登時間），不要預設 active
        // 朝向的"不限"預設為 active，但刊登時間的"不限"不預設
        let isActive = false;
        if (isRadio && isUnlimited) {
          isActive = true; // 朝向的"不限"預設為 active
        }
        
        if (isSingleSelect) {
          // 單選：不使用 radio button，只使用文字
          // 刊登時間的所有選項都不預設為 active
          return `
            <div class="more-option" data-value="${item}" data-single-select="true">
              <span>${item}</span>
            </div>
          `;
        } else if (isRadio) {
          // 朝向：使用 radio button
          // 朝向的"不限"預設為 active
          return `
            <label class="more-option ${isActive ? 'active' : ''}" data-value="${item}">
              <input type="radio" name="${tab.key}" ${isActive ? 'checked' : ''} />
              <span>${item}</span>
            </label>
          `;
        } else {
          // 不限：沒有 checkbox
          if (isUnlimited) {
            // 複選篩選器的"不限"預設為 active
            return `
              <div class="more-option unlimited active" data-value="不限">
                ${item}
              </div>
            `;
          }

          // 其他選項：有 checkbox
          return `
            <label class="more-option" data-value="${item}">
              <input type="checkbox" />
              <span>${item}</span>
            </label>
          `;
        }
      })
      .join("");
  }
  
  // 如果是屋齡，在選項列表後面添加輸入框
  if (isAge) {
    optionsHTML += `
      <div class="custom-input-section" data-type="age">
        <div class="custom-input-container">
          <div class="custom-input-group">
            <div class="custom-input-wrapper">
              <input type="number" class="custom-input" min="0" step="1" placeholder="最小屋齡">
            </div>
            <span class="custom-input-separator">-</span>
            <div class="custom-input-wrapper">
              <input type="number" class="custom-input" min="0" step="1" placeholder="最大屋齡">
            </div>
            <span class="custom-input-unit">年</span>
            <button class="custom-input-confirm-btn">確認</button>
          </div>
        </div>
      </div>
    `;
  }
  
  // 如果是樓層，在選項列表後面添加輸入框
  if (isFloor) {
    optionsHTML += `
      <div class="custom-input-section" data-type="floor">
        <div class="custom-input-container">
          <div class="custom-input-group">
            <div class="custom-input-wrapper">
              <input type="number" class="custom-input" min="0" step="1" placeholder="最小樓層">
            </div>
            <span class="custom-input-separator">-</span>
            <div class="custom-input-wrapper">
              <input type="number" class="custom-input" min="0" step="1" placeholder="最大樓層">
            </div>
            <span class="custom-input-unit">層</span>
            <button class="custom-input-confirm-btn">確認</button>
          </div>
        </div>
      </div>
    `;
  }
  
  return optionsHTML;
}

// 渲染類型選項（使用 filter-tab 類別，與位置篩選器一致）
function renderTypeOptions(tab) {
  return tab.options
    .map(item => {
      const isUnlimited = item === "不限";
      const isActive = isUnlimited; // 預設"不限"是選中的
      
      return `
        <button
          class="filter-tab ${isActive ? "active" : ""}" 
          data-value="${item}"
          data-filter-key="type">
          ${item}
        </button>
      `;
    })
    .join("");
}

// 渲染售價選項
function renderPriceOptions(tab) {
  return tab.options
    .map(item => {
      const isUnlimited = item === "不限";
      const isCustom = item === "自訂售價";
      const isActive = isUnlimited; // 預設"不限"是選中的
      
      if (isUnlimited) {
        // 不限：沒有 checkbox，使用 button
        return `
          <button
            class="filter-tab ${isActive ? "active" : ""}" 
            data-value="${item}"
            data-filter-key="price">
            ${item}
          </button>
        `;
      } else if (isCustom) {
        // 自訂售價：特殊按鈕
        return `
          <button
            class="custom-price-btn filter-tab" 
            data-value="${item}"
            data-filter-key="price">
            自訂售價
          </button>
        `;
      } else {
        // 其他售價選項：有 checkbox，使用 label
        return `
          <label class="price-option" data-value="${item}" data-filter-key="price">
            <input type="checkbox" />
            <span>${item}</span>
          </label>
        `;
      }
    })
    .join("");
}

// 渲染型態選項
function renderShapeOptions(tab) {
  return tab.options
    .map(item => {
      const isUnlimited = item === "不限";
      const isActive = isUnlimited; // 預設"不限"是選中的
      
      if (isUnlimited) {
        // 不限：沒有 checkbox，使用 button
        return `
          <button
            class="filter-tab ${isActive ? "active" : ""}" 
            data-value="${item}"
            data-filter-key="shape">
            ${item}
          </button>
        `;
      } else {
        // 其他型態選項：有 checkbox，使用 label
        return `
          <label class="shape-option" data-value="${item}" data-filter-key="shape">
            <input type="checkbox" />
            <span>${item}</span>
          </label>
        `;
      }
    })
    .join("");
}

// 渲染格局選項
function renderLayoutOptions(tab) {
  return tab.options
    .map(item => {
      const isUnlimited = item === "不限";
      const isActive = isUnlimited; // 預設"不限"是選中的
      
      if (isUnlimited) {
        // 不限：沒有 checkbox，使用 button
        return `
          <button
            class="filter-tab ${isActive ? "active" : ""}" 
            data-value="${item}"
            data-filter-key="layout">
            ${item}
          </button>
        `;
      } else {
        // 其他格局選項：有 checkbox，使用 label
        return `
          <label class="layout-option" data-value="${item}" data-filter-key="layout">
            <input type="checkbox" />
            <span>${item}</span>
          </label>
        `;
      }
    })
    .join("");
}

// 渲染權狀選項
function renderSquareOptions(tab) {
  const options = getSquareOptions();
  
  return options
    .map(item => {
      const isUnlimited = item === "不限";
      const isCustom = item === "自訂坪數";
      const isActive = isUnlimited; // 預設"不限"是選中的
      
      if (isUnlimited) {
        // 不限：沒有 checkbox，使用 button
        return `
          <button
            class="filter-tab ${isActive ? "active" : ""}" 
            data-value="${item}"
            data-filter-key="square">
            ${item}
          </button>
        `;
      } else if (isCustom) {
        // 自訂坪數：特殊按鈕
        return `
          <button
            class="custom-square-btn filter-tab" 
            data-value="${item}"
            data-filter-key="square">
            自訂坪數
          </button>
        `;
      } else {
        // 其他權狀選項：有 checkbox，使用 label
        return `
          <label class="square-option" data-value="${item}" data-filter-key="square">
            <input type="checkbox" />
            <span>${item}</span>
          </label>
        `;
      }
    })
    .join("");
}

// 獲取權狀選項（根據類型）
function getSquareOptions() {
  if (squareType === '主建') {
    // 主建模式：移除 60-100坪 和 100坪以上，改為 60坪以上
    return [
      "不限",
      "20坪以下",
      "20-30坪",
      "30-40坪",
      "40-50坪",
      "50-60坪",
      "60坪以上",
      "自訂坪數"
    ];
  } else {
    // 權狀模式：保持原樣
    const squareConfig = filterConfig.find(group => group.key === 'square');
    return squareConfig.tabs[0].options;
  }
}

// 重繪權狀篩選器
function renderSquareFilter() {
  const squareGroup = document.querySelector('.filter-group[data-filter-key="square"]');
  if (squareGroup) {
    const squareConfig = filterConfig.find(group => group.key === 'square');
    squareGroup.innerHTML = renderFilterGroup(squareConfig).trim();
  }
}

// 應用篩選器
function applyFilters() {
  console.log("應用篩選器，當前選擇:", filterSelections);
  
  if (!window.products || window.products.length === 0) {
    console.error("沒有商品數據");
    return;
  }
  
  // 複製原始商品數據
  let filteredProducts = [...window.products];
  
  // 位置篩選
  if (filterSelections.location.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      filterSelections.location.includes(product.area)
    );
  }
  
  // 類型篩選
  if (filterSelections.type && filterSelections.type !== "不限") {
    // 這裡需要商品數據中有 type 屬性，我們暫時先註解掉
    // filteredProducts = filteredProducts.filter(product => 
    //   product.type === filterSelections.type
    // );
  }
  
  // 價格篩選
  if (filterSelections.price.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const price = product.price;
      return filterSelections.price.some(range => {
        // 檢查是否是自訂範圍（格式如 "1000-2000萬"）
        if (range.includes('-') && range.includes('萬')) {
          const rangeWithoutUnit = range.replace('萬', '');
          const [min, max] = rangeWithoutUnit.split('-').map(num => parseInt(num));
          return price >= min && price <= max;
        }
        
        if (range === "1000萬以下") return price < 1000;
        if (range === "1000-1500萬") return price >= 1000 && price < 1500;
        if (range === "1500-2000萬") return price >= 1500 && price < 2000;
        if (range === "2000-2500萬") return price >= 2000 && price < 2500;
        if (range === "2500-3000萬") return price >= 2500 && price < 3000;
        if (range === "3000-3500萬") return price >= 3000 && price < 3500;
        if (range === "3500-4000萬") return price >= 3500 && price < 4000;
        if (range === "4000-4500萬") return price >= 4000 && price < 4500;
        if (range === "4500-5000萬") return price >= 4500 && price < 5000;
        if (range === "5000萬以上") return price >= 5000;
        return false;
      });
    });
  }
  
  // 權狀面積篩選
  if (filterSelections.square.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const size = product.size;
      return filterSelections.square.some(range => {
        // 檢查是否是自訂範圍（格式如 "30-50坪"）
        if (range.includes('-') && range.includes('坪')) {
          const rangeWithoutUnit = range.replace('坪', '');
          const [min, max] = rangeWithoutUnit.split('-').map(num => parseFloat(num));
          return size >= min && size <= max;
        }
        
        if (range === "20坪以下") return size < 20;
        if (range === "20-30坪") return size >= 20 && size < 30;
        if (range === "30-40坪") return size >= 30 && size < 40;
        if (range === "40-50坪") return size >= 40 && size < 50;
        if (range === "50-60坪") return size >= 50 && size < 60;
        if (range === "60-100坪") return size >= 60 && size < 100;
        if (range === "100坪以上") return size >= 100;
        if (range === "60坪以上") return size >= 60; // 主建模式
        return false;
      });
    });
  }
  
  // 格局篩選
  if (filterSelections.layout.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const layout = product.layout;
      return filterSelections.layout.some(option => {
        if (option === "1房") return layout.includes("1房");
        if (option === "2房") return layout.includes("2房");
        if (option === "3房") return layout.includes("3房");
        if (option === "4房") return layout.includes("4房");
        if (option === "5房及以上") return layout.includes("5房") || layout.includes("6房") || layout.includes("7房");
        return false;
      });
    });
  }
  
  // 型態篩選
  if (filterSelections.shape.length > 0) {
    // 這裡需要商品數據中有 shape 屬性，我們暫時先註解掉
    // filteredProducts = filteredProducts.filter(product => 
    //   filterSelections.shape.includes(product.shape)
    // );
  }
  
  // 更多篩選 - 屋齡
  if (filterSelections.more.age.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const age = product.age;
      return filterSelections.more.age.some(range => {
        // 檢查是否是自訂範圍（格式如 "5-10"）
        if (range.includes('-') && !range.includes('年')) {
          const [min, max] = range.split('-').map(num => parseInt(num));
          return age >= min && age <= max;
        }
        
        if (range === "5年以下") return age < 5;
        if (range === "5-10年") return age >= 5 && age < 10;
        if (range === "10-20年") return age >= 10 && age < 20;
        if (range === "20-30年") return age >= 20 && age < 30;
        if (range === "30-40年") return age >= 30 && age < 40;
        if (range === "40年以上") return age >= 40;
        return false;
      });
    });
  }
  
  // 更多篩選 - 單價
  if (filterSelections.more.unitPrice.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const unitPrice = product.unitPrice;
      return filterSelections.more.unitPrice.some(range => {
        if (range === "20萬以下") return unitPrice < 20;
        if (range === "20-30萬") return unitPrice >= 20 && unitPrice < 30;
        if (range === "30-50萬") return unitPrice >= 30 && unitPrice < 50;
        if (range === "50-70萬") return unitPrice >= 50 && unitPrice < 70;
        if (range === "70萬以上") return unitPrice >= 70;
        return false;
      });
    });
  }
  
  // 更多篩選 - 樓層
  if (filterSelections.more.floor.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const floor = product.floor;
      return filterSelections.more.floor.some(range => {
        // 檢查是否是自訂範圍（格式如 "5-10"）
        if (range.includes('-') && !range.includes('層')) {
          const [min, max] = range.split('-').map(num => parseInt(num));
          return floor >= min && floor <= max;
        }
        
        // 處理預設選項
        if (range === "1層") return floor === 1;
        if (range === "2-6層") return floor >= 2 && floor <= 6;
        if (range === "6-12層") return floor >= 6 && floor <= 12;
        if (range === "12層以上") return floor >= 12;
        if (range === "地下樓") return floor < 1;
        if (range === "整棟") return floor === 0; // 假設整棟為0
        return false;
      });
    });
  }
  
  // 更多篩選 - 朝向
  if (filterSelections.more.direction && filterSelections.more.direction !== "不限") {
    // 這裡需要商品數據中有 direction 屬性，我們暫時先註解掉
    // filteredProducts = filteredProducts.filter(product => 
    //   product.direction === filterSelections.more.direction
    // );
  }
  
  // 更多篩選 - 刊登時間
  if (filterSelections.more.listTime && filterSelections.more.listTime !== "不限") {
    // 這裡需要商品數據中有 listTime 屬性，我們暫時先註解掉
    // filteredProducts = filteredProducts.filter(product => 
    //   product.listTime === filterSelections.more.listTime
    // );
  }
  
  console.log(`篩選後商品數量: ${filteredProducts.length}`);
  
  // 渲染篩選後的商品
  if (typeof renderProductList === 'function') {
    renderProductList(filteredProducts);
  } else {
    console.error("renderProductList 函數未定義");
  }
}

// 重置篩選器
function resetFilters() {
  // 重置篩選狀態
  filterSelections = {
    location: [],
    type: '',
    price: [],
    shape: [],
    layout: [],
    square: [],
    more: {
      listTime: '',
      age: [],
      unitPrice: [],
      direction: '',
      floor: [],
      bathroom: [],
      decoration: [],
      living: [],
      agent: [],
      parking: []
    }
  };
  
  // 重置UI狀態
  document.querySelectorAll('.filter-tab.active').forEach(btn => {
    if (btn.dataset.value === "不限") {
      // 保留"不限"按鈕的active狀態
    } else {
      btn.classList.remove('active');
    }
  });
  
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
    cb.closest('.location-option, .price-option, .shape-option, .layout-option, .square-option, .more-option')?.classList.remove('active');
  });
  
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.checked = false;
  });
  
  // 重置位置篩選器的"不限"為active
  document.querySelectorAll('.location-option.unlimited').forEach(el => {
    el.classList.add('active');
  });
  
  // 重置更多篩選器的"不限"為active
  document.querySelectorAll('.more-option.unlimited').forEach(el => {
    el.classList.add('active');
  });
  
  // 重置自訂輸入框
  document.querySelectorAll('.custom-input').forEach(input => {
    input.value = '';
  });
  
  // 重置自訂售價和自訂坪數輸入框
  document.querySelectorAll('.custom-price-container, .custom-square-container').forEach(container => {
    const originalValue = container.classList.contains('custom-price-container') ? '自訂售價' : '自訂坪數';
    const filterKey = container.classList.contains('custom-price-container') ? 'price' : 'square';
    container.outerHTML = `
      <button
        class="${filterKey === 'price' ? 'custom-price-btn' : 'custom-square-btn'} filter-tab" 
        data-value="${originalValue}"
        data-filter-key="${filterKey}">
        ${originalValue}
      </button>
    `;
  });
  
  // 重置權狀類型
  squareType = '權狀';
  renderSquareFilter();
  
  // 重置更多篩選器的按鈕文字
  document.querySelectorAll('.more-filter-tab').forEach(btn => {
    const originalName = filterConfig.find(group => group.key === 'more')
      .tabs.find(tab => tab.key === btn.dataset.tab).name;
    btn.textContent = `${originalName} ▾`;
  });
  
  // 應用重置（顯示所有商品）
  applyFilters();
}

// 專門處理自訂輸入確認按鈕的函數
function handleCustomInputConfirm(confirmBtn) {
  console.log("自訂輸入確認按鈕被點擊");
  
  const dropdown = confirmBtn.closest('.more-dropdown');
  if (!dropdown) return;
  
  const customInputs = dropdown.querySelectorAll('.custom-input');
  const minInput = customInputs[0];
  const maxInput = customInputs[1];
  const minValue = minInput.value.trim();
  const maxValue = maxInput.value.trim();
  const inputType = dropdown.querySelector('.custom-input-section').dataset.type;
  
  console.log(`自訂${inputType === 'age' ? '屋齡' : '樓層'}輸入: ${minValue} - ${maxValue}`);
  
  if (minValue && maxValue) {
    const minNum = parseInt(minValue);
    const maxNum = parseInt(maxValue);
    
    if (minNum > maxNum) {
      alert('最小值不能大於最大值');
      return;
    }
    
    if (minNum < 0 || maxNum < 0) {
      alert(`${inputType === 'age' ? '屋齡' : '樓層'}不能為負數`);
      return;
    }
    
    // 取消所有預設選項的選中狀態
    const allOptions = dropdown.querySelectorAll('.more-option');
    allOptions.forEach(option => {
      option.classList.remove('active');
      const checkbox = option.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.checked = false;
      const radio = option.querySelector('input[type="radio"]');
      if (radio) radio.checked = false;
    });
    
    // 更新篩選狀態
    if (inputType === 'age') {
      filterSelections.more.age = [`${minNum}-${maxNum}`];
    } else if (inputType === 'floor') {
      filterSelections.more.floor = [`${minNum}-${maxNum}`];
    }
    
    console.log(`設定自訂${inputType === 'age' ? '屋齡' : '樓層'}: ${filterSelections.more[inputType]}`);
    
    // 更新按鈕文字顯示自訂範圍
    const tabBtn = dropdown.closest('.more-tab-wrapper').querySelector('.more-filter-tab');
    if (tabBtn) {
      const unit = inputType === 'age' ? '年' : '層';
      const title = inputType === 'age' ? '屋齡' : '樓層';
      tabBtn.textContent = `${title} (${minValue}-${maxValue}${unit}) ▾`;
    }
    
    // 清空輸入框
    minInput.value = '';
    maxInput.value = '';
    
    // 隱藏下拉框
    dropdown.style.display = 'none';
    
    // 應用篩選
    applyFilters();
  } else {
    alert('請輸入完整的範圍');
  }
}

// 創建自訂售價輸入框
function createCustomPriceInputs(clickedBtn) {
  const filterGroup = clickedBtn.closest('.filter-group');
  
  // 先移除所有按鈕的 active 類別
  const priceButtons = filterGroup.querySelectorAll('.filter-tab');
  priceButtons.forEach(btn => btn.classList.remove('active'));
  
  // 將被點擊的按鈕替換為輸入框
  clickedBtn.outerHTML = `
    <div class="custom-price-container">
      <div class="price-input-group">
        <div class="price-input-wrapper">
          <input type="number" class="price-input" placeholder="最低售價" min="0">
        </div>
        <span class="price-separator">-</span>
        <div class="price-input-wrapper">
          <input type="number" class="price-input" placeholder="最高售價" min="0">
        </div>
        <span class="price-unit">萬</span>
      </div>
      <button class="price-confirm-btn">確認</button>
    </div>
  `;
  
  // 重新獲取新創建的元素
  const customPriceContainer = filterGroup.querySelector('.custom-price-container');
  const priceInputs = customPriceContainer.querySelectorAll('.price-input');
  const confirmBtn = customPriceContainer.querySelector('.price-confirm-btn');
  
  // 初始隱藏確認按鈕
  confirmBtn.style.display = 'none';
  
  priceInputs.forEach(input => {
    input.addEventListener('input', function() {
      const bothFilled = Array.from(priceInputs).every(input => input.value.trim() !== '');
      confirmBtn.style.display = bothFilled ? 'block' : 'none';
    });
  });
  
  confirmBtn.addEventListener('click', function() {
    const minInput = priceInputs[0];
    const maxInput = priceInputs[1];
    const minValue = minInput.value.trim();
    const maxValue = maxInput.value.trim();
    
    if (minValue && maxValue) {
      const minNum = parseInt(minValue);
      const maxNum = parseInt(maxValue);
      
      if (minNum > maxNum) {
        alert('最低售價不能大於最高售價');
        return;
      }
      
      // 取消所有其他價格選項的選中狀態
      const priceCheckboxes = filterGroup.querySelectorAll('.price-option input[type="checkbox"]');
      const unlimitedBtn = filterGroup.querySelector('.filter-tab[data-value="不限"]');
      const otherPriceButtons = filterGroup.querySelectorAll('.filter-tab');
      
      priceCheckboxes.forEach(cb => {
        cb.checked = false;
        cb.closest(".price-option").classList.remove("active");
      });
      
      otherPriceButtons.forEach(btn => {
        if (btn.dataset.value !== "自訂售價") {
          btn.classList.remove("active");
        }
      });
      
      if (unlimitedBtn) {
        unlimitedBtn.classList.remove("active");
      }
      
      // 更新篩選狀態
      filterSelections.price = [`${minNum}-${maxNum}萬`];
      console.log("自訂價格篩選選擇:", filterSelections.price);
      
      // 應用篩選
      applyFilters();
    }
  });
}

// 創建自訂權狀輸入框
function createCustomSquareInputs(clickedBtn) {
  const filterGroup = clickedBtn.closest('.filter-group');
  
  // 先移除所有按鈕的 active 類別
  const squareButtons = filterGroup.querySelectorAll('.filter-tab');
  squareButtons.forEach(btn => btn.classList.remove('active'));
  
  // 將被點擊的按鈕替換為輸入框
  clickedBtn.outerHTML = `
    <div class="custom-square-container">
      <div class="square-input-group">
        <div class="square-input-wrapper">
          <input type="number" class="square-input" placeholder="最小坪數" min="0" step="0.1">
        </div>
        <span class="square-separator">-</span>
        <div class="square-input-wrapper">
          <input type="number" class="square-input" placeholder="最大坪數" min="0" step="0.1">
        </div>
        <span class="square-unit">坪</span>
      </div>
      <button class="square-confirm-btn">確認</button>
    </div>
  `;
  
  // 重新獲取新創建的元素
  const customSquareContainer = filterGroup.querySelector('.custom-square-container');
  const squareInputs = customSquareContainer.querySelectorAll('.square-input');
  const confirmBtn = customSquareContainer.querySelector('.square-confirm-btn');
  
  // 初始隱藏確認按鈕
  confirmBtn.style.display = 'none';
  
  squareInputs.forEach(input => {
    input.addEventListener('input', function() {
      const bothFilled = Array.from(squareInputs).every(input => input.value.trim() !== '');
      confirmBtn.style.display = bothFilled ? 'block' : 'none';
    });
  });
  
  confirmBtn.addEventListener('click', function() {
    const minInput = squareInputs[0];
    const maxInput = squareInputs[1];
    const minValue = minInput.value.trim();
    const maxValue = maxInput.value.trim();
    
    if (minValue && maxValue) {
      const minNum = parseFloat(minValue);
      const maxNum = parseFloat(maxValue);
      
      if (minNum > maxNum) {
        alert('最小坪數不能大於最大坪數');
        return;
      }
      
      // 取消所有其他權狀選項的選中狀態
      const squareCheckboxes = filterGroup.querySelectorAll('.square-option input[type="checkbox"]');
      const unlimitedBtn = filterGroup.querySelector('.filter-tab[data-value="不限"]');
      const otherSquareButtons = filterGroup.querySelectorAll('.filter-tab');
      
      squareCheckboxes.forEach(cb => {
        cb.checked = false;
        cb.closest(".square-option").classList.remove("active");
      });
      
      otherSquareButtons.forEach(btn => {
        if (btn.dataset.value !== "自訂坪數") {
          btn.classList.remove("active");
        }
      });
      
      if (unlimitedBtn) {
        unlimitedBtn.classList.remove("active");
      }
      
      // 更新篩選狀態
      filterSelections.square = [`${minNum}-${maxNum}坪`];
      console.log("自訂坪數篩選選擇:", filterSelections.square);
      
      // 應用篩選
      applyFilters();
    }
  });
}

// 初始渲染所有篩選器
renderAllFilters();

// 事件監聽器
filterSection.addEventListener("click", function(e) {
  console.log("篩選器區域點擊事件:", e.target);
  
  // ========= 自訂輸入確認按鈕點擊 =========
  const customConfirmBtn = e.target.closest(".custom-input-confirm-btn");
  if (customConfirmBtn) {
    console.log("檢測到自訂輸入確認按鈕");
    e.stopPropagation();
    e.preventDefault();
    handleCustomInputConfirm(customConfirmBtn);
    return;
  }
  
  const tabBtn = e.target.closest(".filter-tab");
  const customPriceBtn = e.target.closest(".custom-price-btn");
  const customSquareBtn = e.target.closest(".custom-square-btn");
  
  // ========= 自訂售價按鈕點擊 =========
  if (customPriceBtn) {
    createCustomPriceInputs(customPriceBtn);
    return;
  }
  
  // ========= 自訂坪數按鈕點擊 =========
  if (customSquareBtn) {
    createCustomSquareInputs(customSquareBtn);
    return;
  }
  
  // 如果是權狀下拉菜單項點擊
  const squareDropdownItem = e.target.closest(".square-dropdown-item");
  if (squareDropdownItem) {
    const newType = squareDropdownItem.dataset.type;
    if (newType !== squareType) {
      squareType = newType;
      renderSquareFilter();
      
      // 重置權狀篩選狀態
      filterSelections.square = [];
      
      // 應用篩選
      applyFilters();
    }
    
    // 隱藏下拉菜單
    const dropdownMenu = document.querySelector('.square-dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.style.display = 'none';
    }
    return;
  }
  
  // 如果是權狀標題點擊（顯示/隱藏下拉菜單）
  const squareTitle = e.target.closest(".square-dropdown-container");
  if (squareTitle && !e.target.closest(".square-dropdown-menu")) {
    const dropdownMenu = squareTitle.querySelector('.square-dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    }
    return;
  }
  
  // 如果是類型篩選器，則處理單選邏輯
  if (tabBtn && tabBtn.dataset.filterKey === 'type') {
    // 找到類型篩選器的 filter-group
    const typeFilterGroup = document.querySelector('.filter-group[data-filter-key="type"]');
    if (!typeFilterGroup) return;
    
    // 移除所有 filter-tab 的 active 類別
    const allTypeTabs = typeFilterGroup.querySelectorAll('.filter-tab');
    allTypeTabs.forEach(tab => {
      tab.classList.remove("active");
    });
    
    // 為點擊的選項添加 active 類別
    tabBtn.classList.add("active");
    
    // 更新篩選狀態
    const value = tabBtn.dataset.value;
    filterSelections.type = value === "不限" ? '' : value;
    console.log("類型篩選選擇:", filterSelections.type);
    
    // 應用篩選
    applyFilters();
    return;
  }
  
  // 如果是售價篩選器的按鈕（不限）
  if (tabBtn && tabBtn.dataset.filterKey === 'price' && tabBtn.dataset.value === "不限") {
    const filterGroup = document.querySelector('.filter-group[data-filter-key="price"]');
    if (!filterGroup) return;
    
    // 取消所有其他選項的選中狀態
    const priceCheckboxes = filterGroup.querySelectorAll('.price-option input[type="checkbox"]');
    const customPriceContainer = filterGroup.querySelector('.custom-price-container');
    const customPriceBtn = filterGroup.querySelector('.custom-price-btn');
    
    priceCheckboxes.forEach(cb => {
      cb.checked = false;
      cb.closest(".price-option").classList.remove("active");
    });
    
    // 移除自訂售價輸入框（如果存在），恢復為按鈕
    if (customPriceContainer) {
      customPriceContainer.outerHTML = `
        <button
          class="custom-price-btn filter-tab" 
          data-value="自訂售價"
          data-filter-key="price">
          自訂售價
        </button>
      `;
    }
    
    // 如果自訂售價按鈕是active狀態，取消active
    if (customPriceBtn && customPriceBtn.classList.contains("active")) {
      customPriceBtn.classList.remove("active");
    }
    
    // 移除所有按鈕的 active 類別
    const priceButtons = filterGroup.querySelectorAll('.filter-tab');
    priceButtons.forEach(btn => {
      btn.classList.remove("active");
    });
    
    // 為點擊的"不限"按鈕添加 active 類別
    tabBtn.classList.add("active");
    
    // 更新篩選狀態
    filterSelections.price = [];
    console.log("價格篩選選擇（不限）:", filterSelections.price);
    
    // 應用篩選
    applyFilters();
    return;
  }
  
  // 如果是型態篩選器的按鈕（不限）
  if (tabBtn && tabBtn.dataset.filterKey === 'shape' && tabBtn.dataset.value === "不限") {
    const filterGroup = document.querySelector('.filter-group[data-filter-key="shape"]');
    if (!filterGroup) return;
    
    // 取消所有其他選項的選中狀態
    const shapeCheckboxes = filterGroup.querySelectorAll('.shape-option input[type="checkbox"]');
    
    shapeCheckboxes.forEach(cb => {
      cb.checked = false;
      cb.closest(".shape-option").classList.remove("active");
    });
    
    // 移除所有按鈕的 active 類別
    const shapeButtons = filterGroup.querySelectorAll('.filter-tab');
    shapeButtons.forEach(btn => {
      btn.classList.remove("active");
    });
    
    // 為點擊的"不限"按鈕添加 active 類別
    tabBtn.classList.add("active");
    
    // 更新篩選狀態
    filterSelections.shape = [];
    console.log("型態篩選選擇（不限）:", filterSelections.shape);
    
    // 應用篩選
    applyFilters();
    return;
  }
  
  // 如果是格局篩選器的按鈕（不限）
  if (tabBtn && tabBtn.dataset.filterKey === 'layout' && tabBtn.dataset.value === "不限") {
    const filterGroup = document.querySelector('.filter-group[data-filter-key="layout"]');
    if (!filterGroup) return;
    
    // 取消所有其他選項的選中狀態
    const layoutCheckboxes = filterGroup.querySelectorAll('.layout-option input[type="checkbox"]');
    
    layoutCheckboxes.forEach(cb => {
      cb.checked = false;
      cb.closest(".layout-option").classList.remove("active");
    });
    
    // 移除所有按鈕的 active 類別
    const layoutButtons = filterGroup.querySelectorAll('.filter-tab');
    layoutButtons.forEach(btn => {
      btn.classList.remove("active");
    });
    
    // 為點擊的"不限"按鈕添加 active 類別
    tabBtn.classList.add("active");
    
    // 更新篩選狀態
    filterSelections.layout = [];
    console.log("格局篩選選擇（不限）:", filterSelections.layout);
    
    // 應用篩選
    applyFilters();
    return;
  }
  
  // 如果是權狀篩選器的按鈕（不限）
  if (tabBtn && tabBtn.dataset.filterKey === 'square' && tabBtn.dataset.value === "不限") {
    const filterGroup = document.querySelector('.filter-group[data-filter-key="square"]');
    if (!filterGroup) return;
    
    // 取消所有其他選項的選中狀態
    const squareCheckboxes = filterGroup.querySelectorAll('.square-option input[type="checkbox"]');
    const customSquareContainer = filterGroup.querySelector('.custom-square-container');
    const customSquareBtn = filterGroup.querySelector('.custom-square-btn');
    
    squareCheckboxes.forEach(cb => {
      cb.checked = false;
      cb.closest(".square-option").classList.remove("active");
    });
    
    // 移除自訂權狀輸入框（如果存在），恢復為按鈕
    if (customSquareContainer) {
      customSquareContainer.outerHTML = `
        <button
          class="custom-square-btn filter-tab" 
          data-value="自訂坪數"
          data-filter-key="square">
          自訂坪數
        </button>
      `;
    }
    
    // 如果自訂權狀按鈕是active狀態，取消active
    if (customSquareBtn && customSquareBtn.classList.contains("active")) {
      customSquareBtn.classList.remove("active");
    }
    
    // 移除所有按鈕的 active 類別
    const squareButtons = filterGroup.querySelectorAll('.filter-tab');
    squareButtons.forEach(btn => {
      btn.classList.remove("active");
    });
    
    // 為點擊的"不限"按鈕添加 active 類別
    tabBtn.classList.add("active");
    
    // 更新篩選狀態
    filterSelections.square = [];
    console.log("權狀篩選選擇（不限）:", filterSelections.square);
    
    // 應用篩選
    applyFilters();
    return;
  }
  
  // 位置篩選器的處理邏輯
  if (tabBtn && tabBtn.dataset.filterKey === 'location') {
    const tabKey = tabBtn.dataset.tab;
    
    // 找到對應的篩選組
    const filterGroup = document.querySelector(`.filter-group[data-filter-key="location"]`);
    if (!filterGroup) return;
    
    const panel = filterGroup.querySelector(".filter-panel");
    const isActive = tabBtn.classList.contains("active");
    
    // 更新篩選器狀態
    const panelIsOpen = panel.classList.contains("open");

    // 👉 如果 panel 已開 且 點擊的是 active tab → 收合
    if (panelIsOpen && isActive) {
      panel.classList.remove("open");
      filterStates['location'] = false;
      
      // 只關閉當前篩選組的tab active狀態
      filterGroup.querySelectorAll(".filter-tab").forEach(btn =>
        btn.classList.remove("active")
      );
      return;
    }

    // 👉 展開 panel
    panel.classList.add("open");
    filterStates['location'] = true;

    // 只切換當前篩選組的tab active狀態
    filterGroup.querySelectorAll(".filter-tab").forEach(btn =>
      btn.classList.remove("active")
    );
    tabBtn.classList.add("active");

    // 更新內容
    const filterConfigGroup = filterConfig.find(
      group => group.key === 'location'
    );
    const tabData = filterConfigGroup.tabs.find(
      tab => tab.key === tabKey
    );

    // 設置面板的數據屬性
    panel.setAttribute("data-tab", tabKey);
    
    // 更新面板內容
    panel.innerHTML = renderOptions(tabData);
    return;
  }

  /* ========= 位置篩選器選項點擊 ========= */
  const locationOption = e.target.closest(".location-option");
  if (locationOption) {
    // 找到對應的篩選組
    const filterGroup = locationOption.closest(".filter-group");
    const filterKey = filterGroup.dataset.filterKey;
    
    const value = locationOption.dataset.value;
    const unlimited = filterGroup.querySelector(".location-option.unlimited");
    const checkboxes = filterGroup.querySelectorAll(
      '.location-option input[type="checkbox"]'
    );

    if (value === "不限") {
      checkboxes.forEach(cb => {
        cb.checked = false;
        cb.closest(".location-option").classList.remove("active");
      });
      unlimited.classList.add("active");
      
      // 更新篩選狀態
      filterSelections.location = [];
      console.log("位置篩選選擇（不限）:", filterSelections.location);
      
      // 應用篩選
      applyFilters();
      return;
    }

    const checkbox = locationOption.querySelector("input");
    checkbox.checked = !checkbox.checked;
    locationOption.classList.toggle("active", checkbox.checked);

    unlimited.classList.remove("active");

    const anyChecked = [...checkboxes].some(cb => cb.checked);
    if (!anyChecked) {
      unlimited.classList.add("active");
    }
    
    // 更新篩選狀態
    if (checkbox.checked) {
      if (!filterSelections.location.includes(value)) {
        filterSelections.location.push(value);
      }
    } else {
      filterSelections.location = filterSelections.location.filter(item => item !== value);
    }
    
    // 如果沒有任何選項被選中，則清空篩選
    if (!anyChecked) {
      filterSelections.location = [];
    }
    
    console.log("位置篩選選擇:", filterSelections.location);
    
    // 應用篩選
    applyFilters();
    return;
  }

  /* ========= 售價篩選器的 checkbox 選項點擊 ========= */
  const priceOption = e.target.closest(".price-option");
  if (priceOption) {
    const filterGroup = priceOption.closest(".filter-group");
    const filterKey = filterGroup.dataset.filterKey;
    
    if (filterKey === 'price') {
      const checkbox = priceOption.querySelector("input");
      const value = priceOption.dataset.value;
      
      // 切換 checkbox 狀態
      checkbox.checked = !checkbox.checked;
      priceOption.classList.toggle("active", checkbox.checked);
      
      // 取消"不限"的 active 狀態
      const unlimitedBtn = filterGroup.querySelector('.filter-tab[data-value="不限"]');
      const customPriceContainer = filterGroup.querySelector('.custom-price-container');
      const customPriceBtn = filterGroup.querySelector('.custom-price-btn');
      const priceButtons = filterGroup.querySelectorAll('.filter-tab');
      
      priceButtons.forEach(btn => {
        if (btn.dataset.value === "不限") {
          btn.classList.remove("active");
        }
      });
      
      // 移除自訂售價輸入框（如果存在），恢復為按鈕
      if (customPriceContainer) {
        customPriceContainer.outerHTML = `
          <button
            class="custom-price-btn filter-tab" 
            data-value="自訂售價"
            data-filter-key="price">
            自訂售價
          </button>
        `;
      }
      
      // 如果自訂售價按鈕是active狀態，取消active
      if (customPriceBtn && customPriceBtn.classList.contains("active")) {
        customPriceBtn.classList.remove("active");
      }
      
      // 如果沒有任何 checkbox 被選中，則自動選中"不限"
      const allPriceCheckboxes = filterGroup.querySelectorAll('.price-option input[type="checkbox"]');
      const anyChecked = [...allPriceCheckboxes].some(cb => cb.checked);
      if (!anyChecked) {
        unlimitedBtn.classList.add("active");
      }
      
      // 更新篩選狀態
      if (checkbox.checked) {
        if (!filterSelections.price.includes(value)) {
          filterSelections.price.push(value);
        }
      } else {
        filterSelections.price = filterSelections.price.filter(item => item !== value);
      }
      
      // 如果沒有任何 checkbox 被選中，則清空篩選
      if (!anyChecked) {
        filterSelections.price = [];
      }
      
      console.log("價格篩選選擇:", filterSelections.price);
      
      // 應用篩選
      applyFilters();
    }
    return;
  }

  /* ========= 型態篩選器的 checkbox 選項點擊 ========= */
  const shapeOption = e.target.closest(".shape-option");
  if (shapeOption) {
    const filterGroup = shapeOption.closest(".filter-group");
    const filterKey = filterGroup.dataset.filterKey;
    
    if (filterKey === 'shape') {
      const checkbox = shapeOption.querySelector("input");
      const value = shapeOption.dataset.value;
      
      // 切換 checkbox 狀態
      checkbox.checked = !checkbox.checked;
      shapeOption.classList.toggle("active", checkbox.checked);
      
      // 取消"不限"的 active 狀態
      const unlimitedBtn = filterGroup.querySelector('.filter-tab[data-value="不限"]');
      const shapeButtons = filterGroup.querySelectorAll('.filter-tab');
      
      shapeButtons.forEach(btn => {
        if (btn.dataset.value === "不限") {
          btn.classList.remove("active");
        }
      });
      
      // 如果沒有任何 checkbox 被選中，則自動選中"不限"
      const allShapeCheckboxes = filterGroup.querySelectorAll('.shape-option input[type="checkbox"]');
      const anyChecked = [...allShapeCheckboxes].some(cb => cb.checked);
      if (!anyChecked) {
        unlimitedBtn.classList.add("active");
      }
      
      // 更新篩選狀態
      if (checkbox.checked) {
        if (!filterSelections.shape.includes(value)) {
          filterSelections.shape.push(value);
        }
      } else {
        filterSelections.shape = filterSelections.shape.filter(item => item !== value);
      }
      
      // 如果沒有任何 checkbox 被選中，則清空篩選
      if (!anyChecked) {
        filterSelections.shape = [];
      }
      
      console.log("型態篩選選擇:", filterSelections.shape);
      
      // 應用篩選
      applyFilters();
    }
    return;
  }

  /* ========= 格局篩選器的 checkbox 選項點擊 ========= */
  const layoutOption = e.target.closest(".layout-option");
  if (layoutOption) {
    const filterGroup = layoutOption.closest(".filter-group");
    const filterKey = filterGroup.dataset.filterKey;
    
    if (filterKey === 'layout') {
      const checkbox = layoutOption.querySelector("input");
      const value = layoutOption.dataset.value;
      
      // 切換 checkbox 狀態
      checkbox.checked = !checkbox.checked;
      layoutOption.classList.toggle("active", checkbox.checked);
      
      // 取消"不限"的 active 狀態
      const unlimitedBtn = filterGroup.querySelector('.filter-tab[data-value="不限"]');
      const layoutButtons = filterGroup.querySelectorAll('.filter-tab');
      
      layoutButtons.forEach(btn => {
        if (btn.dataset.value === "不限") {
          btn.classList.remove("active");
        }
      });
      
      // 如果沒有任何 checkbox 被選中，則自動選中"不限"
      const allLayoutCheckboxes = filterGroup.querySelectorAll('.layout-option input[type="checkbox"]');
      const anyChecked = [...allLayoutCheckboxes].some(cb => cb.checked);
      if (!anyChecked) {
        unlimitedBtn.classList.add("active");
      }
      
      // 更新篩選狀態
      if (checkbox.checked) {
        if (!filterSelections.layout.includes(value)) {
          filterSelections.layout.push(value);
        }
      } else {
        filterSelections.layout = filterSelections.layout.filter(item => item !== value);
      }
      
      // 如果沒有任何 checkbox 被選中，則清空篩選
      if (!anyChecked) {
        filterSelections.layout = [];
      }
      
      console.log("格局篩選選擇:", filterSelections.layout);
      
      // 應用篩選
      applyFilters();
    }
    return;
  }

  /* ========= 權狀篩選器的 checkbox 選項點擊 ========= */
  const squareOption = e.target.closest(".square-option");
  if (squareOption) {
    const filterGroup = squareOption.closest(".filter-group");
    const filterKey = filterGroup.dataset.filterKey;
    
    if (filterKey === 'square') {
      const checkbox = squareOption.querySelector("input");
      const value = squareOption.dataset.value;
      
      // 切換 checkbox 狀態
      checkbox.checked = !checkbox.checked;
      squareOption.classList.toggle("active", checkbox.checked);
      
      // 取消"不限"的 active 狀態
      const unlimitedBtn = filterGroup.querySelector('.filter-tab[data-value="不限"]');
      const customSquareContainer = filterGroup.querySelector('.custom-square-container');
      const customSquareBtn = filterGroup.querySelector('.custom-square-btn');
      const squareButtons = filterGroup.querySelectorAll('.filter-tab');
      
      squareButtons.forEach(btn => {
        if (btn.dataset.value === "不限") {
          btn.classList.remove("active");
        }
      });
      
      // 移除自訂權狀輸入框（如果存在），恢復為按鈕
      if (customSquareContainer) {
        customSquareContainer.outerHTML = `
          <button
            class="custom-square-btn filter-tab" 
            data-value="自訂坪數"
            data-filter-key="square">
            自訂坪數
          </button>
        `;
      }
      
      // 如果自訂權狀按鈕是active狀態，取消active
      if (customSquareBtn && customSquareBtn.classList.contains("active")) {
        customSquareBtn.classList.remove("active");
      }
      
      // 如果沒有任何 checkbox 被選中，則自動選中"不限"
      const allSquareCheckboxes = filterGroup.querySelectorAll('.square-option input[type="checkbox"]');
      const anyChecked = [...allSquareCheckboxes].some(cb => cb.checked);
      if (!anyChecked) {
        unlimitedBtn.classList.add("active");
      }
      
      // 更新篩選狀態
      if (checkbox.checked) {
        if (!filterSelections.square.includes(value)) {
          filterSelections.square.push(value);
        }
      } else {
        filterSelections.square = filterSelections.square.filter(item => item !== value);
      }
      
      // 如果沒有任何 checkbox 被選中，則清空篩選
      if (!anyChecked) {
        filterSelections.square = [];
      }
      
      console.log("權狀篩選選擇:", filterSelections.square);
      
      // 應用篩選
      applyFilters();
    }
    return;
  }

  /* ========= 更多篩選器選項點擊 ========= */
  const moreOption = e.target.closest(".more-option");
  if (moreOption) {
    const dropdown = moreOption.closest(".more-dropdown");
    if (dropdown) {
      const tabKey = dropdown.dataset.tab;
      const value = moreOption.dataset.value;
      
      // 根據 tabKey 判斷是否是單選或複選
      const isSingleSelect = ['listTime'].includes(tabKey); // 只保留刊登時間為單選
      const isRadio = ['direction'].includes(tabKey); // 朝向使用 radio
      const isFloor = tabKey === 'floor'; // 樓層特殊處理
      const isAge = tabKey === 'age'; // 屋齡特殊處理
      const isPricePerSquareMeter = tabKey === 'unitPrice'; // 單價特殊處理
      
      console.log(`點擊了 ${tabKey} 篩選器的選項: ${value}`); // 調試用
      
      // 如果是樓層選項
      if (isFloor) {
        // 清空輸入框的值
        const customInputs = dropdown.querySelectorAll('.custom-input');
        customInputs.forEach(input => {
          input.value = '';
        });
        
        // 複選邏輯
        const checkbox = moreOption.querySelector("input");
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          moreOption.classList.toggle("active", checkbox.checked);
          
          // 更新篩選狀態
          if (checkbox.checked) {
            if (!filterSelections.more.floor.includes(value)) {
              filterSelections.more.floor.push(value);
            }
          } else {
            filterSelections.more.floor = filterSelections.more.floor.filter(item => item !== value);
          }
          
          // 如果有選項被選中，重置按鈕文字為"樓層 ▾"
          const anyChecked = [...dropdown.querySelectorAll('.more-option input[type="checkbox"]')]
            .some(cb => cb.checked);
          if (anyChecked) {
            const tabBtn = dropdown.closest('.more-tab-wrapper').querySelector('.more-filter-tab');
            if (tabBtn) {
              tabBtn.textContent = '樓層 ▾';
            }
          }
          
          console.log("樓層篩選選擇:", filterSelections.more.floor);
          
          // 應用篩選
          applyFilters();
        }
        return;
      }
      
      if (isSingleSelect) {
        // 單選邏輯（沒有radio button）- 處理刊登時間
        const allOptions = dropdown.querySelectorAll('.more-option[data-single-select="true"]');
        allOptions.forEach(option => {
          option.classList.remove('active');
        });
        
        // 被點擊的選項變為 active
        moreOption.classList.add('active');
        
        // 更新篩選狀態
        filterSelections.more.listTime = value === "不限" ? '' : value;
        console.log("刊登時間篩選:", filterSelections.more.listTime);
        
        // 更新按鈕文字為選中的選項（保留下拉箭頭）
        const tabBtn = dropdown.closest('.more-tab-wrapper').querySelector('.more-filter-tab');
        if (tabBtn) {
          // 移除原本的文字，只保留選項文字和下拉箭頭
          tabBtn.textContent = `${value} ▾`;
        }
        
        // 應用篩選
        applyFilters();
        return;
      } else if (isRadio) {
        // radio button 單選邏輯
        const allOptions = dropdown.querySelectorAll('.more-option');
        allOptions.forEach(option => {
          option.classList.remove('active');
          const radio = option.querySelector('input[type="radio"]');
          if (radio) radio.checked = false;
        });
        
        moreOption.classList.add('active');
        const radio = moreOption.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        
        // 更新篩選狀態
        filterSelections.more.direction = value === "不限" ? '' : value;
        console.log("朝向篩選:", filterSelections.more.direction);
        
        // 應用篩選
        applyFilters();
        return;
      } else {
        // 複選邏輯 - 處理屋齡、單價等
        const unlimited = dropdown.querySelector(".more-option.unlimited");
        const checkboxes = dropdown.querySelectorAll('.more-option input[type="checkbox"]');

        if (value === "不限") {
          checkboxes.forEach(cb => {
            cb.checked = false;
            const option = cb.closest(".more-option");
            if (option) {
              option.classList.remove("active");
            }
          });
          unlimited.classList.add("active");
          
          // 更新篩選狀態
          if (isAge) {
            filterSelections.more.age = [];
          } else if (isPricePerSquareMeter) {
            filterSelections.more.unitPrice = [];
          } else {
            filterSelections.more[tabKey] = [];
          }
          
          // 更新按鈕文字為"不限 ▾"
          const tabBtn = dropdown.closest('.more-tab-wrapper').querySelector('.more-filter-tab');
          if (tabBtn) {
            tabBtn.textContent = '不限 ▾';
          }
          
          // 清空自訂輸入框
          const customInputs = dropdown.querySelectorAll('.custom-input');
          customInputs.forEach(input => {
            input.value = '';
          });
          
          // 應用篩選
          applyFilters();
          return;
        }

        const checkbox = moreOption.querySelector("input");
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          moreOption.classList.toggle("active", checkbox.checked);
          
          // 移除"不限"的 active 狀態
          if (unlimited) {
            unlimited.classList.remove("active");
          }

          // 檢查是否沒有任何選項被選中
          const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
          
          // 更新篩選狀態
          if (isAge) {
            if (checkbox.checked) {
              if (!filterSelections.more.age.includes(value)) {
                filterSelections.more.age.push(value);
              }
            } else {
              filterSelections.more.age = filterSelections.more.age.filter(item => item !== value);
            }
            console.log("屋齡篩選選擇:", filterSelections.more.age);
          } else if (isPricePerSquareMeter) {
            if (checkbox.checked) {
              if (!filterSelections.more.unitPrice.includes(value)) {
                filterSelections.more.unitPrice.push(value);
              }
            } else {
              filterSelections.more.unitPrice = filterSelections.more.unitPrice.filter(item => item !== value);
            }
            console.log("單價篩選選擇:", filterSelections.more.unitPrice);
          } else {
            if (checkbox.checked) {
              if (!filterSelections.more[tabKey] || !filterSelections.more[tabKey].includes(value)) {
                if (!filterSelections.more[tabKey]) filterSelections.more[tabKey] = [];
                filterSelections.more[tabKey].push(value);
              }
            } else {
              filterSelections.more[tabKey] = filterSelections.more[tabKey].filter(item => item !== value);
            }
            console.log(`${tabKey}篩選選擇:`, filterSelections.more[tabKey]);
          }
          
          // 如果是屋齡或單價，則更新按鈕文字為第一個選中的選項
          if (isAge || isPricePerSquareMeter) {
            const checkedOptions = dropdown.querySelectorAll('.more-option input[type="checkbox"]:checked');
            const tabBtn = dropdown.closest('.more-tab-wrapper').querySelector('.more-filter-tab');
            if (tabBtn) {
              if (checkedOptions.length > 0) {
                // 取第一個選中的選項的data-value
                const firstValue = checkedOptions[0].closest('.more-option').dataset.value;
                tabBtn.textContent = `${firstValue} ▾`;
                console.log(`更新按鈕文字為: ${firstValue} ▾`); // 調試用
              } else {
                // 如果沒有選中的選項，則恢復為原始名稱
                const originalName = filterConfig.find(group => group.key === 'more')
                  .tabs.find(tab => tab.key === tabKey).name;
                tabBtn.textContent = `${originalName} ▾`;
              }
            }
          } else {
            // 其他複選篩選器，保持原來的邏輯
            if (!anyChecked && unlimited) {
              unlimited.classList.add("active");
              
              // 清空篩選狀態
              filterSelections.more[tabKey] = [];
            }
          }
          
          // 清空自訂輸入框
          const customInputs = dropdown.querySelectorAll('.custom-input');
          customInputs.forEach(input => {
            input.value = '';
          });
          
          // 應用篩選
          applyFilters();
        }
        return;
      }
    }
    return;
  }
  
  // 點擊頁面其他位置時隱藏權狀下拉菜單
  const dropdownMenu = document.querySelector('.square-dropdown-menu');
  if (dropdownMenu && dropdownMenu.style.display === 'block') {
    dropdownMenu.style.display = 'none';
  }
});

// 添加滑鼠懸浮事件來控制更多篩選器的下拉框
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded - 初始化篩選器事件");
  
  // 初始化更多篩選器下拉框的滑鼠事件
  const moreTabWrappers = document.querySelectorAll('.more-tab-wrapper');
  
  // 修改滑鼠懸浮事件
  moreTabWrappers.forEach(wrapper => {
    const tabBtn = wrapper.querySelector('.more-filter-tab');
    const dropdown = wrapper.querySelector('.more-dropdown');
    
    if (tabBtn && dropdown) {
      // 滑鼠進入按鈕時顯示下拉框
      tabBtn.addEventListener('mouseenter', function() {
        dropdown.style.display = 'block';
      });
      
      // 滑鼠離開按鈕時隱藏下拉框
      tabBtn.addEventListener('mouseleave', function(e) {
        // 給一點延遲，讓用戶可以移動到下拉框
        setTimeout(() => {
          if (!dropdown.matches(':hover')) {
            dropdown.style.display = 'none';
          }
        }, 100);
      });
      
      // 滑鼠進入下拉框時保持顯示
      dropdown.addEventListener('mouseenter', function() {
        this.style.display = 'block';
      });
      
      // 滑鼠離開下拉框時隱藏
      dropdown.addEventListener('mouseleave', function(e) {
        setTimeout(() => {
          if (!this.matches(':hover') && !tabBtn.matches(':hover')) {
            this.style.display = 'none';
          }
        }, 100);
      });
      
      // 為自訂輸入框添加點擊事件，防止下拉框關閉
      dropdown.addEventListener('click', function(e) {
        // 如果點擊的是自訂輸入框或確認按鈕，阻止事件冒泡
        if (e.target.classList.contains('custom-input') || 
            e.target.classList.contains('custom-input-confirm-btn')) {
          e.stopPropagation();
        }
      });
    }
  });
  
  // 點擊頁面其他位置時隱藏所有下拉框
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.more-tab-wrapper')) {
      const dropdowns = document.querySelectorAll('.more-dropdown');
      dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
      });
    }
    
    // 隱藏權狀下拉菜單
    const dropdownMenu = document.querySelector('.square-dropdown-menu');
    if (dropdownMenu && dropdownMenu.style.display === 'block' && !e.target.closest('.square-dropdown-container')) {
      dropdownMenu.style.display = 'none';
    }
  });
  
  // 添加重置篩選按鈕
  const filterActions = document.createElement('div');
  filterActions.className = 'filter-actions';
  filterActions.innerHTML = '<button id="reset-filters" class="reset-btn">重置篩選</button>';
  filterSection.parentNode.insertBefore(filterActions, filterSection);
  
  // 添加重置按鈕事件
  document.getElementById('reset-filters').addEventListener('click', resetFilters);
  
  // 為自訂輸入框添加事件監聽
  setTimeout(() => {
    document.addEventListener('click', function(e) {
      // 如果點擊的是自訂輸入確認按鈕
      if (e.target.classList.contains('custom-input-confirm-btn')) {
        console.log("檢測到自訂輸入確認按鈕點擊 (全域監聽)");
        e.stopPropagation();
        e.preventDefault();
        handleCustomInputConfirm(e.target);
      }
    });
  }, 1000);
});

// 確保篩選器在詳細頁面返回後正常工作
function reinitializeFilters() {
  console.log("重新初始化篩選器事件");
  
  // 重新綁定篩選器事件
  if (window.filterSection) {
    // 這裡可以重新綁定所有篩選器事件
    // 由於篩選器是動態生成的，可能需要重新綁定事件
    // 但實際上，如果篩選器元素沒有被移除，事件應該仍然有效
    console.log("篩選器事件已保持");
  }
}

// 修改返回商品列表函數，確保篩選器正常工作
window.backToProductList = function() {
  const mainContent = document.getElementById("main-content");
  const detailSection = document.getElementById("product-detail-section");
  
  if (detailSection) {
    detailSection.classList.remove('active');
    
    setTimeout(() => {
      detailSection.style.display = 'none';
      if (mainContent) {
        mainContent.style.display = 'block';
      }
      
      // 更新URL
      const url = new URL(window.location);
      url.searchParams.delete('product');
      window.history.pushState({}, '', url);
      
      // 恢復頁面標題
      document.title = "房屋篩選系統 | 商品展示";
      
      // 重新初始化篩選器事件（如果需要）
      reinitializeFilters();
    }, 300);
  }
};

// 在 filter.js 的 DOMContentLoaded 事件中，添加移動設備優化
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded - 添加移動設備優化");
  
  // 檢查是否是移動設備
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 為移動設備添加額外的觸摸事件支持
    console.log("檢測到移動設備，優化觸摸體驗");
    
    // 為篩選器選項添加觸摸反饋
    const touchElements = document.querySelectorAll('.filter-tab, .location-option, .price-option, .shape-option, .layout-option, .square-option, .more-option');
    
    touchElements.forEach(el => {
      el.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      });
      
      el.addEventListener('touchend', function() {
        setTimeout(() => {
          this.classList.remove('touch-active');
        }, 200);
      });
      
      el.addEventListener('touchcancel', function() {
        this.classList.remove('touch-active');
      });
    });
  }
  
  // 為篩選器下拉框添加移動設備關閉功能
  document.addEventListener('touchstart', function(e) {
    // 如果點擊的是篩選器區域外，關閉所有下拉框
    if (!e.target.closest('.filter-group') && 
        !e.target.closest('.more-tab-wrapper') &&
        !e.target.closest('.square-dropdown-container')) {
      const dropdowns = document.querySelectorAll('.more-dropdown, .square-dropdown-menu');
      dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
      });
    }
  });
  
  // 防止下拉框內的滾動事件冒泡
  const dropdowns = document.querySelectorAll('.more-dropdown, .square-dropdown-menu');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('touchmove', function(e) {
      e.stopPropagation();
    });
  });
});

// 在CSS中添加觸摸反饋樣式
const touchStyles = `
.filter-tab.touch-active,
.location-option.touch-active,
.price-option.touch-active,
.shape-option.touch-active,
.layout-option.touch-active,
.square-option.touch-active,
.more-option.touch-active {
  background-color: #e9ecef !important;
  transform: scale(0.98);
  transition: transform 0.1s ease;
}
`;

// 動態添加觸摸樣式到文檔
const styleSheet = document.createElement('style');
styleSheet.textContent = touchStyles;
document.head.appendChild(styleSheet);