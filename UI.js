// UI.js

// 时间轴组件
class Timeline {
    constructor(container) {
        this.container = document.querySelector(container);
        this.init();
    }

    init() {
        this.addHoverEffects();
        this.container.addEventListener('click', (e) => {
            const item = e.target.closest('.timeline-item');
            if (item) {
                this.toggleDetails(item);
            }
        });
    }

    addHoverEffects() {
        // 为每个时间轴项目添加悬停效果
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('mouseover', () => {
                this.animateItem(item, true);
                this.updateDateDisplay(item.getAttribute('data-date')); // 更新悬停时的日期显示
            });

            item.addEventListener('mouseout', () => {
                this.animateItem(item, false);
                this.updateDateDisplay(''); // 滑鼠移开时清除日期显示
            });
        });
    }

    animateItem(item, hovering) {
        let start = null;
        const effectDuration = 300; // 动画时长，单位毫秒
        const initialBoxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        const initialTransform = -5;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / effectDuration, 1);

            if (hovering) {
                item.style.boxShadow = `0 4px 8px rgba(0, 0, 0, ${0.5 * percentage})`;
                item.style.transform = `translateY(${initialTransform * percentage}px)`;
            } else {
                item.style.boxShadow = `0 4px 8px rgba(0, 0, 0, ${0.5 * (1 - percentage)})`;
                item.style.transform = `translateY(${initialTransform * (1 - percentage)}px)`;
            }

            if (progress < effectDuration) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    updateDateDisplay(date) {
        const dateDisplay = document.querySelector('.date-display'); // 假设您有一个用于显示日期的元素
        dateDisplay.textContent = date;
    }

    toggleDetails(item) {
        // 使用弹出窗口来显示详细信息
        alert(`Toggle details for: ${item.querySelector('h2').textContent}`);
    }
}

// 在页面上初始化时间轴组件
const myTimeline = new Timeline('.timeline-container');

document.addEventListener('DOMContentLoaded', function () {
    drawLineChart();
});

function drawLineChart() {
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');

    // 數據點
    const data = [12, 19, 3, 5, 2, 3];
    const labels = ['一月', '二月', '三月', '四月', '五月', '六月'];

    // 計算繪圖區域
    const padding = 40;
    const plotAreaWidth = canvas.width - 2 * padding;
    const plotAreaHeight = canvas.height - 2 * padding;

    // 繪製坐標軸
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // 計算點的位置
    const xStep = plotAreaWidth / (labels.length - 1);
    const yMax = Math.max(...data);
    const points = data.map((point, index) => ({
        x: padding + index * xStep,
        y: padding + plotAreaHeight - (point / yMax) * plotAreaHeight
    }));

    // 繪製數據線和點
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => {
        ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // 添加標籤
    labels.forEach((label, index) => {
        ctx.fillText(label, padding + index * xStep - 10, canvas.height - padding + 20);
    });
}

function drawBarChart() {
    const canvas = document.getElementById('myChartBar');
    if (!canvas) {
        console.log('Canvas element not found!');
        return;
    }
    const ctx = canvas.getContext('2d');

    // 數據點
    const data = [15, 20, 8, 12, 6, 9];
    const labels = ['一月', '二月', '三月', '四月', '五月', '六月'];
    const colors = ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'];

    // 清除先前的繪製
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 設定繪圖區域和條形的寬度
    const barWidth = 50;
    const padding = 40;
    const plotAreaWidth = canvas.width - 2 * padding;
    const plotAreaHeight = canvas.height - 2 * padding;
    const xStep = (plotAreaWidth / labels.length);

    // 繪製坐標軸
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // 繪製柱體
    data.forEach((value, index) => {
        const barHeight = (value / Math.max(...data)) * (plotAreaHeight - padding);
        const x = padding + index * xStep + (xStep / 2 - barWidth / 2);
        const y = canvas.height - padding - barHeight;

        ctx.fillStyle = colors[index];
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = '#000';
        ctx.fillText(labels[index], x + barWidth / 2, canvas.height - padding + 15);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    drawLineChart();
    drawBarChart(); // 確保你有一個 id 為 'myChartBar' 的 canvas 元素來繪製柱狀圖
});
function drawPieChart() {
    const canvas = document.getElementById('myChartPie');
    if (!canvas) {
        console.log('Canvas element for pie chart not found!');
        return;
    }
    const ctx = canvas.getContext('2d');
    const data = [12, 19, 7, 13, 5]; // 示例數據
    const colors = ['red', 'green', 'blue', 'orange', 'purple']; // 扇形顏色
    const labels = ['一月', '二月', '三月', '四月', '五月']; // 標籤

    // 計算總數
    const total = data.reduce((sum, value) => sum + value, 0);
    let startAngle = 0;

    data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI; // 扇形的角度
        const endAngle = startAngle + sliceAngle;
        const middleAngle = startAngle + sliceAngle / 2;
        const radius = Math.min(canvas.width, canvas.height) / 2; // 餅圖半徑

        // 繪製扇形
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();

        // 添加標籤
        const textX = canvas.width / 2 + radius * 0.5 * Math.cos(middleAngle);
        const textY = canvas.height / 2 + radius * 0.5 * Math.sin(middleAngle);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = '16px Arial';
        ctx.fillText(labels[index], textX, textY);

        startAngle = endAngle;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    drawPieChart(); // 確保你有一個 id 為 'myChartPie' 的 canvas 元素
});

function drawRadarChart() {
    const canvas = document.getElementById('myChartRadar');
    if (!canvas) {
        console.log('Canvas element for radar chart not found!');
        return;
    }
    const ctx = canvas.getContext('2d');

    // 數據和配置
    const data = [65, 59, 90, 81, 56, 55, 40]; // 示例數據
    const labels = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];
    const maxVal = 100; // 數據最大值
    const numLevels = 5; // 網格層級數量

    const radius = canvas.height / 2; // 雷達圖半徑
    const angleStep = (2 * Math.PI) / labels.length;

    // 繪製網格
    ctx.translate(canvas.width / 2, canvas.height / 2); // 將原點移至中心
    for (let level = 0; level < numLevels; level++) {
        ctx.beginPath();
        for (let i = 0; i < labels.length; i++) {
            const r = radius * ((level + 1) / numLevels);
            const x = r * Math.cos(angleStep * i);
            const y = r * Math.sin(angleStep * i);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
    }

    // 繪製數據
    ctx.beginPath();
    data.forEach((value, i) => {
        const r = radius * (value / maxVal);
        const x = r * Math.cos(angleStep * i);
        const y = r * Math.sin(angleStep * i);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();
    ctx.strokeStyle = '#FF6347';
    ctx.fillStyle = 'rgba(255, 99, 71, 0.5)';
    ctx.fill();
    ctx.stroke();

    // 標籤
    labels.forEach((label, i) => {
        const r = radius + 20; // 標籤位置稍微超出最外圈
        const x = r * Math.cos(angleStep * i);
        const y = r * Math.sin(angleStep * i);
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y);
    });

    ctx.translate(-canvas.width / 2, -canvas.height / 2); // 恢復原點位置
}

document.addEventListener('DOMContentLoaded', function () {
    drawRadarChart(); // 確保你有一個 id 為 'myChartRadar' 的 canvas 元素
});
function drawScatterPlot() {
    const canvas = document.getElementById('myChartScatter');
    if (!canvas) {
        console.log('Canvas element for scatter plot not found!');
        return;
    }
    const ctx = canvas.getContext('2d');

    // 數據
    const data = [
        {x: 10, y: 20}, {x: 15, y: 35}, {x: 20, y: 25},
        {x: 25, y: 55}, {x: 30, y: 45}, {x: 35, y: 60}
    ];

    // 設定
    const padding = 40;
    const xMax = Math.max(...data.map(d => d.x));
    const yMax = Math.max(...data.map(d => d.y));

    // 清除之前的繪畫
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製坐標軸
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, padding);
    ctx.stroke();

    // 繪製數據點
    data.forEach(point => {
        const x = ((point.x / xMax) * (canvas.width - 2 * padding)) + padding;
        const y = canvas.height - padding - ((point.y / yMax) * (canvas.height - 2 * padding));

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2, true);
        ctx.fill();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    drawScatterPlot(); // 確保你有一個 id 為 'myChartScatter' 的 canvas 元素
});
function drawAreaChart() {
    const canvas = document.getElementById('myChartArea');
    if (!canvas) {
        console.log('Canvas element for area chart not found!');
        return;
    }
    const ctx = canvas.getContext('2d');

    // 數據點
    const data = [20, 30, 15, 50, 40, 60, 40];
    const labels = ['一月', '二月', '三月', '四月', '五月', '六月', '七月'];

    // 設定
    const padding = 40;
    const plotHeight = canvas.height - 2 * padding;
    const plotWidth = canvas.width - 2 * padding;
    const stepX = plotWidth / (labels.length - 1);

    // 清除先前的繪畫
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製坐標軸
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // 繪製區域圖
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    data.forEach((point, index) => {
        const x = padding + stepX * index;
        const y = canvas.height - padding - (point / 100 * plotHeight);
        ctx.lineTo(x, y);
    });
    ctx.lineTo(padding + plotWidth, canvas.height - padding);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 99, 132, 0.5)';
    ctx.fill();
    ctx.stroke();

    // 添加標籤
    labels.forEach((label, index) => {
        ctx.fillText(label, padding + stepX * index, canvas.height - padding + 20);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('userInput');
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
            event.preventDefault(); // 防止表單提交等默認行為
        }
    });
});

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (message) {
        const chatList = document.getElementById('chatList');
        const li = document.createElement('li');
        li.textContent = message;
        chatList.appendChild(li);
        input.value = ''; // 清空輸入框
        // 模擬虛擬助理回答
        setTimeout(() => {
            const li = document.createElement('li');
            li.textContent = '這是助理的回答...';
            li.style.backgroundColor = 'lightgreen';
            chatList.appendChild(li);
        }, 1000);
    }
}

