import { AdminLayout } from "../../components/AdminLayout.js";
import { showLoading, hideLoading, showToast } from "../../../core/utils/helpers.js";
import userStatisticsController from "../../../controllers/userStatisticsController.js";

/**
 * Admin Analytics Page
 * Trang thống kê người dùng mới theo tuần / tháng / năm
 */
export default async function AdminAnalyticsPage() {
  showLoading();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();

  // Build year options: 5 năm gần nhất
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)
    .map((y) => `<option value="${y}" ${y === currentYear ? "selected" : ""}>${y}</option>`)
    .join("");

  // Build month options
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const monthOptions = monthNames
    .map(
      (name, i) =>
        `<option value="${i + 1}" ${i + 1 === currentMonth ? "selected" : ""}>${name}</option>`,
    )
    .join("");

  const content = `
    <div class="space-y-6">
 
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Thống kê người dùng</h1>
          <p class="mt-1 text-gray-600">Biểu đồ người dùng mới theo thời gian</p>
        </div>
      </div>
 
      <!-- Chart Card -->
      <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
 
        <!-- Card Header: controls -->
        <div class="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
 
          <!-- Type selector -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Xem theo:</label>
            <select
              id="typeSelect"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
            >
              <option value="WEEK">Tuần</option>
              <option value="MONTH">Tháng</option>
              <option value="YEAR">Năm</option>
            </select>
          </div>
 
          <!-- Month controls (hidden by default) -->
          <div id="monthControls" class="hidden flex items-center gap-2 flex-wrap">
            <select
              id="monthSelect"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
            >
              ${monthOptions}
            </select>
            <select
              id="monthYearSelect"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
            >
              ${yearOptions}
            </select>
          </div>
 
          <!-- Year controls (hidden by default) -->
          <div id="yearControls" class="hidden flex items-center gap-2">
            <select
              id="yearSelect"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
            >
              ${yearOptions}
            </select>
          </div>
 
          <!-- Spacer + chart label -->
          <div class="ml-auto">
            <span id="chartLabel" class="text-sm font-semibold text-gray-500"></span>
          </div>
        </div>
 
        <!-- Chart area -->
        <div class="px-6 py-6 relative" style="min-height: 340px;">
          <!-- Loading overlay -->
          <div
            id="chartLoading"
            class="hidden absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10"
          >
            <div class="flex flex-col items-center gap-3">
              <div class="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-sm text-gray-500">Đang tải dữ liệu...</span>
            </div>
          </div>
 
          <!-- Empty state -->
          <div
            id="chartEmpty"
            class="hidden absolute inset-0 flex items-center justify-center"
          >
            <div class="text-center">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                </path>
              </svg>
              <p class="text-gray-400 text-sm">Không có dữ liệu để hiển thị</p>
            </div>
          </div>
 
          <canvas id="newUsersChart" height="300"></canvas>
        </div>
 
        <!-- Summary footer -->
        <div id="chartSummary" class="hidden px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div class="flex flex-wrap gap-6 text-sm text-gray-600">
            <div>
              Tổng: <strong id="summaryTotal" class="text-gray-900">0</strong> người dùng mới
            </div>
            <div>
              Cao nhất: <strong id="summaryPeak" class="text-green-700">0</strong>
            </div>
            <div>
              Trung bình: <strong id="summaryAvg" class="text-blue-700">0</strong>/ngày
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const layoutContent = AdminLayout(content);

  setTimeout(() => {
    initAnalyticsPage(currentMonth, currentYear);
    hideLoading();
  }, 100);

  return layoutContent;
}

// ─── Chart.js CDN inject (chỉ load 1 lần) ───────────────────────────────────
function loadChartJs(callback) {
  if (window.Chart) return callback();
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
  script.onload = callback;
  document.head.appendChild(script);
}

// ─── Init ────────────────────────────────────────────────────────────────────
function initAnalyticsPage(currentMonth, currentYear) {
  loadChartJs(() => {
    let chartInstance = null;

    const typeSelect = document.getElementById("typeSelect");
    const monthControls = document.getElementById("monthControls");
    const yearControls = document.getElementById("yearControls");
    const monthSelect = document.getElementById("monthSelect");
    const monthYearSelect = document.getElementById("monthYearSelect");
    const yearSelect = document.getElementById("yearSelect");

    if (!typeSelect) return;

    // ── Show / hide secondary controls based on type ──
    function updateControlsVisibility(type) {
      monthControls.classList.toggle("hidden", type !== "MONTH");
      yearControls.classList.toggle("hidden", type !== "YEAR");
    }

    // ── Fetch + render chart ──
    async function fetchAndRender() {
      const type = typeSelect.value;
      const params = { type };

      if (type === "MONTH") {
        params.month = parseInt(monthSelect.value);
        params.year = parseInt(monthYearSelect.value);
      } else if (type === "YEAR") {
        params.year = parseInt(yearSelect.value);
      }

      showChartLoading(true);
      hideChartEmpty();
      hideChartSummary();

      try {
        const data = await userStatisticsController.getNewUserStats(params);

        if (!data || !data.labels || data.labels.length === 0) {
          showChartLoading(false);
          showChartEmpty();
          destroyChart(chartInstance);
          return;
        }

        chartInstance = renderChart(chartInstance, data, type);
        updateChartLabel(data);
        updateSummary(data);
      } catch (err) {
        showChartLoading(false);
        showToast(err.message || "Lỗi khi tải dữ liệu thống kê", "error");
      }
    }

    // ── Event listeners ──
    typeSelect.addEventListener("change", () => {
      updateControlsVisibility(typeSelect.value);
      fetchAndRender();
    });

    // Month: fetch on any change
    monthSelect.addEventListener("change", fetchAndRender);
    monthYearSelect.addEventListener("change", fetchAndRender);

    // Year: fetch immediately on change
    yearSelect.addEventListener("change", fetchAndRender);

    // Initial render: WEEK default
    updateControlsVisibility("WEEK");
    fetchAndRender();
  });
}

// ─── Chart rendering ─────────────────────────────────────────────────────────
function renderChart(existingInstance, chartData, type) {
  destroyChart(existingInstance);
  showChartLoading(false);

  const ctx = document.getElementById("newUsersChart");
  if (!ctx) return null;

  const dataset = chartData.datasets[0];

  // Styling per type
  const colorMap = {
    WEEK: { border: "#dc2626", bg: "rgba(220,38,38,0.08)", point: "#dc2626" },
    MONTH: { border: "#2563eb", bg: "rgba(37,99,235,0.08)", point: "#2563eb" },
    YEAR: { border: "#16a34a", bg: "rgba(22,163,74,0.08)", point: "#16a34a" },
  };
  const colors = colorMap[type] || colorMap.WEEK;

  return new window.Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: dataset.label,
          data: dataset.data,
          borderColor: colors.border,
          backgroundColor: colors.bg,
          pointBackgroundColor: colors.point,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1f2937",
          titleColor: "#f9fafb",
          bodyColor: "#d1d5db",
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y} người dùng mới`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#6b7280", font: { size: 12 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: "#f3f4f6" },
          ticks: {
            color: "#6b7280",
            font: { size: 12 },
            stepSize: 1,
            precision: 0,
          },
        },
      },
    },
  });
}

function destroyChart(instance) {
  if (instance) {
    try {
      instance.destroy();
    } catch (_) {}
  }
}

// ─── UI helpers ──────────────────────────────────────────────────────────────
function showChartLoading(show) {
  const el = document.getElementById("chartLoading");
  if (el) el.classList.toggle("hidden", !show);
}

function showChartEmpty() {
  const el = document.getElementById("chartEmpty");
  if (el) el.classList.remove("hidden");
  const canvas = document.getElementById("newUsersChart");
  if (canvas) canvas.style.visibility = "hidden";
}

function hideChartEmpty() {
  const el = document.getElementById("chartEmpty");
  if (el) el.classList.add("hidden");
  const canvas = document.getElementById("newUsersChart");
  if (canvas) canvas.style.visibility = "visible";
}

function hideChartSummary() {
  const el = document.getElementById("chartSummary");
  if (el) el.classList.add("hidden");
}

function updateChartLabel(data) {
  const el = document.getElementById("chartLabel");
  if (el && data.datasets?.[0]?.label) {
    el.textContent = data.datasets[0].label;
  }
}

function updateSummary(data) {
  const values = data.datasets?.[0]?.data || [];
  if (values.length === 0) return;

  const total = values.reduce((a, b) => a + b, 0);
  const peak = Math.max(...values);
  const avg = (total / values.length).toFixed(1);

  const summaryEl = document.getElementById("chartSummary");
  if (summaryEl) summaryEl.classList.remove("hidden");

  const totalEl = document.getElementById("summaryTotal");
  const peakEl = document.getElementById("summaryPeak");
  const avgEl = document.getElementById("summaryAvg");

  if (totalEl) totalEl.textContent = total;
  if (peakEl) peakEl.textContent = peak;
  if (avgEl) avgEl.textContent = avg;
}
