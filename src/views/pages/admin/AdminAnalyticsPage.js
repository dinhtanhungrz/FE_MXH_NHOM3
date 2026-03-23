import { AdminLayout } from "../../components/AdminLayout.js";
import { showLoading, hideLoading, showToast } from "../../../core/utils/helpers.js";
import userStatisticsController from "../../../controllers/userStatisticsController.js";
import visitStatisticsController from "../../../controllers/visitStatisticsController.js";

/**
 * Admin Analytics Page
 * Trang thống kê: người dùng mới (LineChart) + lượt truy cập (BarChart)
 */
export default async function AdminAnalyticsPage() {
  showLoading();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)
    .map((y) => `<option value="${y}" ${y === currentYear ? "selected" : ""}>${y}</option>`)
    .join("");

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

  // ── Reusable card builder (dùng cho cả 2 chart) ───────────────────────────
  const buildChartCard = ({
    cardId, // prefix cho tất cả id trong card
    title,
    subtitle,
    typeSelectId,
    monthControlsId,
    monthSelectId,
    monthYearSelectId,
    yearControlsId,
    yearSelectId,
    chartLabelId,
    chartLoadingId,
    chartEmptyId,
    canvasId,
    summaryId,
    summaryTotalId,
    summaryTotalLabel,
    summaryPeakId,
    summaryAvgId,
    summaryAvgLabel,
  }) => `
    <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">

      <!-- Card Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex flex-wrap items-center gap-3">

          <!-- Title -->
          <div class="mr-4">
            <h2 class="text-base font-bold text-gray-800">${title}</h2>
            <p class="text-xs text-gray-500 mt-0.5">${subtitle}</p>
          </div>

          <!-- Type selector -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Xem theo:</label>
            <select
              id="${typeSelectId}"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
              style="appearance:none;-webkit-appearance:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 10px center;padding-right:34px;"
            >
              <option value="WEEK">Tuần</option>
              <option value="MONTH">Tháng</option>
              <option value="YEAR">Năm</option>
            </select>
          </div>

          <!-- Month controls -->
          <div id="${monthControlsId}" class="hidden flex items-center gap-2 flex-wrap">
            <select
              id="${monthSelectId}"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
              style="appearance:none;-webkit-appearance:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 10px center;padding-right:34px;"
            >
              ${monthOptions}
            </select>
            <select
              id="${monthYearSelectId}"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
              style="appearance:none;-webkit-appearance:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 10px center;padding-right:34px;"
            >
              ${yearOptions}
            </select>
          </div>

          <!-- Year controls -->
          <div id="${yearControlsId}" class="hidden flex items-center gap-2">
            <select
              id="${yearSelectId}"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
              style="appearance:none;-webkit-appearance:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 10px center;padding-right:34px;"
            >
              ${yearOptions}
            </select>
          </div>

          <!-- Chart label -->
          <div class="ml-auto">
            <span id="${chartLabelId}" class="text-sm font-semibold text-gray-500"></span>
          </div>
        </div>
      </div>

      <!-- Chart area -->
      <div class="px-6 py-6 relative" style="min-height: 340px;">
        <!-- Loading overlay -->
        <div
          id="${chartLoadingId}"
          class="hidden absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10"
        >
          <div class="flex flex-col items-center gap-3">
            <div class="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-gray-500">Đang tải dữ liệu...</span>
          </div>
        </div>

        <!-- Empty state -->
        <div id="${chartEmptyId}" class="hidden absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
              </path>
            </svg>
            <p class="text-gray-400 text-sm">Không có dữ liệu để hiển thị</p>
          </div>
        </div>

        <canvas id="${canvasId}" height="300"></canvas>
      </div>

      <!-- Summary footer -->
      <div id="${summaryId}" class="hidden px-6 py-4 border-t border-gray-100 bg-gray-50">
        <div class="flex flex-wrap gap-6 text-sm text-gray-600">
          <div>
            Tổng: <strong id="${summaryTotalId}" class="text-gray-900">0</strong> ${summaryTotalLabel}
          </div>
          <div>
            Cao nhất: <strong id="${summaryPeakId}" class="text-green-700">0</strong>
          </div>
          <div>
            Trung bình: <strong id="${summaryAvgId}" class="text-blue-700">0</strong>${summaryAvgLabel}
          </div>
        </div>
      </div>
    </div>
  `;

  const content = `
    <div class="space-y-6">

      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Thống kê</h1>
          <p class="mt-1 text-gray-600">Tổng quan hoạt động hệ thống theo thời gian</p>
        </div>
      </div>

      <!-- Chart 1: New Users (LineChart) -->
      ${buildChartCard({
        title: "Người dùng mới",
        subtitle: "Số lượng đăng ký theo thời gian",
        typeSelectId: "userTypeSelect",
        monthControlsId: "userMonthControls",
        monthSelectId: "userMonthSelect",
        monthYearSelectId: "userMonthYearSelect",
        yearControlsId: "userYearControls",
        yearSelectId: "userYearSelect",
        chartLabelId: "userChartLabel",
        chartLoadingId: "userChartLoading",
        chartEmptyId: "userChartEmpty",
        canvasId: "newUsersChart",
        summaryId: "userChartSummary",
        summaryTotalId: "userSummaryTotal",
        summaryTotalLabel: "người dùng mới",
        summaryPeakId: "userSummaryPeak",
        summaryAvgId: "userSummaryAvg",
        summaryAvgLabel: "/ngày",
      })}

      <!-- Chart 2: Page Visits (BarChart) -->
      ${buildChartCard({
        title: "Lượt truy cập",
        subtitle: "Số lượt truy cập ứng dụng theo thời gian",
        typeSelectId: "visitTypeSelect",
        monthControlsId: "visitMonthControls",
        monthSelectId: "visitMonthSelect",
        monthYearSelectId: "visitMonthYearSelect",
        yearControlsId: "visitYearControls",
        yearSelectId: "visitYearSelect",
        chartLabelId: "visitChartLabel",
        chartLoadingId: "visitChartLoading",
        chartEmptyId: "visitChartEmpty",
        canvasId: "visitsChart",
        summaryId: "visitChartSummary",
        summaryTotalId: "visitSummaryTotal",
        summaryTotalLabel: "lượt truy cập",
        summaryPeakId: "visitSummaryPeak",
        summaryAvgId: "visitSummaryAvg",
        summaryAvgLabel: "/ngày",
      })}

    </div>
  `;

  const layoutContent = AdminLayout(content);

  setTimeout(() => {
    initAnalyticsPage(currentMonth, currentYear);
    hideLoading();
  }, 100);

  return layoutContent;
}

// ─── Chart.js CDN inject (chỉ load 1 lần) ────────────────────────────────────
function loadChartJs(callback) {
  if (window.Chart) return callback();
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
  script.onload = callback;
  document.head.appendChild(script);
}

// ─── Init cả 2 chart ─────────────────────────────────────────────────────────
function initAnalyticsPage(currentMonth, currentYear) {
  loadChartJs(() => {
    initChartWidget({
      typeSelectId: "userTypeSelect",
      monthControlsId: "userMonthControls",
      monthSelectId: "userMonthSelect",
      monthYearSelectId: "userMonthYearSelect",
      yearControlsId: "userYearControls",
      yearSelectId: "userYearSelect",
      chartLabelId: "userChartLabel",
      chartLoadingId: "userChartLoading",
      chartEmptyId: "userChartEmpty",
      canvasId: "newUsersChart",
      summaryId: "userChartSummary",
      summaryTotalId: "userSummaryTotal",
      summaryPeakId: "userSummaryPeak",
      summaryAvgId: "userSummaryAvg",
      chartType: "line",
      tooltipLabel: "người dùng mới",
      colorMap: {
        WEEK: { border: "#dc2626", bg: "rgba(220,38,38,0.08)", point: "#dc2626" },
        MONTH: { border: "#2563eb", bg: "rgba(37,99,235,0.08)", point: "#2563eb" },
        YEAR: { border: "#16a34a", bg: "rgba(22,163,74,0.08)", point: "#16a34a" },
      },
      fetchFn: (params) => userStatisticsController.getNewUserStats(params),
    });

    initChartWidget({
      typeSelectId: "visitTypeSelect",
      monthControlsId: "visitMonthControls",
      monthSelectId: "visitMonthSelect",
      monthYearSelectId: "visitMonthYearSelect",
      yearControlsId: "visitYearControls",
      yearSelectId: "visitYearSelect",
      chartLabelId: "visitChartLabel",
      chartLoadingId: "visitChartLoading",
      chartEmptyId: "visitChartEmpty",
      canvasId: "visitsChart",
      summaryId: "visitChartSummary",
      summaryTotalId: "visitSummaryTotal",
      summaryPeakId: "visitSummaryPeak",
      summaryAvgId: "visitSummaryAvg",
      chartType: "bar",
      tooltipLabel: "lượt truy cập",
      colorMap: {
        WEEK: { border: "#7c3aed", bg: "rgba(124,58,237,0.75)" },
        MONTH: { border: "#0891b2", bg: "rgba(8,145,178,0.75)" },
        YEAR: { border: "#d97706", bg: "rgba(217,119,6,0.75)" },
      },
      fetchFn: (params) => visitStatisticsController.getVisitStats(params),
    });
  });
}

// ─── Generic chart widget init ────────────────────────────────────────────────
function initChartWidget({
  typeSelectId,
  monthControlsId,
  monthSelectId,
  monthYearSelectId,
  yearControlsId,
  yearSelectId,
  chartLabelId,
  chartLoadingId,
  chartEmptyId,
  canvasId,
  summaryId,
  summaryTotalId,
  summaryPeakId,
  summaryAvgId,
  chartType,
  tooltipLabel,
  colorMap,
  fetchFn,
}) {
  let chartInstance = null;

  const typeSelect = document.getElementById(typeSelectId);
  const monthControls = document.getElementById(monthControlsId);
  const yearControls = document.getElementById(yearControlsId);
  const monthSelect = document.getElementById(monthSelectId);
  const monthYearSelect = document.getElementById(monthYearSelectId);
  const yearSelect = document.getElementById(yearSelectId);

  if (!typeSelect) return;

  function updateControlsVisibility(type) {
    monthControls.classList.toggle("hidden", type !== "MONTH");
    yearControls.classList.toggle("hidden", type !== "YEAR");
  }

  async function fetchAndRender() {
    const type = typeSelect.value;
    const params = { type };

    if (type === "MONTH") {
      params.month = parseInt(monthSelect.value);
      params.year = parseInt(monthYearSelect.value);
    } else if (type === "YEAR") {
      params.year = parseInt(yearSelect.value);
    }

    toggleLoading(chartLoadingId, true);
    toggleEmpty(chartEmptyId, canvasId, false);
    toggleSummary(summaryId, false);

    try {
      const data = await fetchFn(params);

      if (!data || !data.labels || data.labels.length === 0) {
        toggleLoading(chartLoadingId, false);
        toggleEmpty(chartEmptyId, canvasId, true);
        destroyChart(chartInstance);
        chartInstance = null;
        return;
      }

      chartInstance = renderChart({
        existingInstance: chartInstance,
        chartData: data,
        type,
        canvasId,
        chartType,
        tooltipLabel,
        colorMap,
        chartLoadingId,
      });

      updateLabel(chartLabelId, data);
      updateSummary({ summaryId, summaryTotalId, summaryPeakId, summaryAvgId }, data);
    } catch (err) {
      toggleLoading(chartLoadingId, false);
      showToast(err.message || "Lỗi khi tải dữ liệu thống kê", "error");
    }
  }

  typeSelect.addEventListener("change", () => {
    updateControlsVisibility(typeSelect.value);
    fetchAndRender();
  });
  monthSelect.addEventListener("change", fetchAndRender);
  monthYearSelect.addEventListener("change", fetchAndRender);
  yearSelect.addEventListener("change", fetchAndRender);

  updateControlsVisibility("WEEK");
  fetchAndRender();
}

// ─── Chart rendering ──────────────────────────────────────────────────────────
function renderChart({
  existingInstance,
  chartData,
  type,
  canvasId,
  chartType,
  tooltipLabel,
  colorMap,
  chartLoadingId,
}) {
  destroyChart(existingInstance);
  toggleLoading(chartLoadingId, false);

  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const dataset = chartData.datasets[0];
  const colors = colorMap[type] || Object.values(colorMap)[0];

  const isLine = chartType === "line";

  const datasetConfig = isLine
    ? {
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
      }
    : {
        label: dataset.label,
        data: dataset.data,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      };

  return new window.Chart(ctx, {
    type: chartType,
    data: {
      labels: chartData.labels,
      datasets: [datasetConfig],
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
            label: (ctx) => ` ${ctx.parsed.y} ${tooltipLabel}`,
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
          ticks: { color: "#6b7280", font: { size: 12 }, precision: 0 },
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

// ─── UI helpers ───────────────────────────────────────────────────────────────
function toggleLoading(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("hidden", !show);
}

function toggleEmpty(emptyId, canvasId, show) {
  const emptyEl = document.getElementById(emptyId);
  const canvasEl = document.getElementById(canvasId);
  if (emptyEl) emptyEl.classList.toggle("hidden", !show);
  if (canvasEl) canvasEl.style.visibility = show ? "hidden" : "visible";
}

function toggleSummary(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("hidden", !show);
}

function updateLabel(labelId, data) {
  const el = document.getElementById(labelId);
  if (el && data.datasets?.[0]?.label) el.textContent = data.datasets[0].label;
}

function updateSummary({ summaryId, summaryTotalId, summaryPeakId, summaryAvgId }, data) {
  const values = data.datasets?.[0]?.data || [];
  if (values.length === 0) return;

  const total = values.reduce((a, b) => a + b, 0);
  const peak = Math.max(...values);
  const avg = (total / values.length).toFixed(1);

  toggleSummary(summaryId, true);

  const totalEl = document.getElementById(summaryTotalId);
  const peakEl = document.getElementById(summaryPeakId);
  const avgEl = document.getElementById(summaryAvgId);

  if (totalEl) totalEl.textContent = total;
  if (peakEl) peakEl.textContent = peak;
  if (avgEl) avgEl.textContent = avg;
}
