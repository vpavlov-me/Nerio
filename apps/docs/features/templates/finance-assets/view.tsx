"use client";

import * as React from "react";
import { densities, modes, themes } from "@nerio-ui/tokens";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "@nerio-ui/adapters/charts";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Boxes,
  CalendarDays,
  Check,
  CircleAlert,
  FileText,
  Github,
  LayoutDashboard,
  PanelLeft,
  Settings,
} from "@nerio-ui/adapters/icons";
import type { IconComponent } from "@nerio-ui/adapters/icons";
import {
  LuArrowLeftRight,
  LuBriefcaseBusiness,
  LuChartNoAxesCombined,
  LuChartPie,
  LuEye,
  LuEyeOff,
  LuWalletCards,
} from "react-icons/lu";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  type BadgeTone,
} from "@nerio-ui/ui";
import {
  Alert,
  Badge,
  Button,
  Dialog,
  DialogFooter,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  KeyValue,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  Stat,
  Toggle,
  Tooltip,
} from "@nerio-ui/ui/client";
import {
  applyAppearanceAxis,
  captureAppearanceAttributes,
  defaultAppearance,
  readAppearanceFromRoot,
  type Appearance,
} from "../../../lib/appearance";
import templateLayoutStyles from "../layout.module.css";
import styles from "./view.module.css";

type TransactionStatus = "Completed" | "Pending" | "Failed";
type PerformancePeriod = "1M" | "3M" | "1Y";

const financeTemplateSourceUrl =
  "https://github.com/vpavlov-me/Nerio/tree/main/apps/docs/features/templates/finance-assets";

type Holding = {
  id: string;
  name: string;
  symbol: string;
  type: string;
  quantity: number;
  price: number;
  allocation: number;
  movement: number;
  value: number;
  volatility: string;
  liquidity: string;
};

const defaultHolding: Holding = {
  id: "index",
  name: "Global index fund",
  symbol: "NWLD",
  type: "Fund",
  quantity: 314.82,
  price: 142.67,
  allocation: 35.8,
  movement: 1.24,
  value: 44917,
  volatility: "Moderate",
  liquidity: "T+2",
};

const holdings: Holding[] = [
  {
    id: "cash",
    name: "Operating cash",
    symbol: "USD",
    type: "Cash",
    quantity: 42850,
    price: 1,
    allocation: 34.2,
    movement: 0,
    value: 42850,
    volatility: "Low",
    liquidity: "Immediate",
  },
  defaultHolding,
  {
    id: "treasury",
    name: "Short treasury fund",
    symbol: "USTX",
    type: "Fixed income",
    quantity: 226.4,
    price: 104.31,
    allocation: 18.8,
    movement: 0.18,
    value: 23617,
    volatility: "Low",
    liquidity: "T+1",
  },
  {
    id: "digital",
    name: "Digital asset reserve",
    symbol: "DBTC",
    type: "Digital asset",
    quantity: 0.1974,
    price: 71240,
    allocation: 11.2,
    movement: -2.31,
    value: 14064,
    volatility: "High",
    liquidity: "Immediate",
  },
];

const transactions: {
  id: string;
  title: string;
  detail: string;
  date: string;
  amount: number;
  kind: "Incoming" | "Outgoing" | "Exchange";
  status: TransactionStatus;
}[] = [
  {
    id: "tx-1",
    title: "Client settlement",
    detail: "Into Operating cash",
    date: "Today, 09:42",
    amount: 8400,
    kind: "Incoming",
    status: "Completed",
  },
  {
    id: "tx-2",
    title: "Global index purchase",
    detail: "Operating cash → NWLD",
    date: "Yesterday, 15:16",
    amount: -3200,
    kind: "Exchange",
    status: "Completed",
  },
  {
    id: "tx-3",
    title: "Treasury allocation",
    detail: "Operating cash → USTX",
    date: "Jul 21, 11:08",
    amount: -5000,
    kind: "Exchange",
    status: "Pending",
  },
  {
    id: "tx-4",
    title: "Vendor transfer",
    detail: "From Operating cash",
    date: "Jul 19, 16:30",
    amount: -1280,
    kind: "Outgoing",
    status: "Failed",
  },
  {
    id: "tx-5",
    title: "Reserve contribution",
    detail: "Into Digital asset reserve",
    date: "Jul 18, 12:04",
    amount: 750,
    kind: "Incoming",
    status: "Completed",
  },
];

type PerformancePoint = {
  label: string;
  portfolio: number;
  benchmark: number;
};

const performanceByPeriod: Record<PerformancePeriod, PerformancePoint[]> = {
  "1M": [
    { label: "Jun 23", portfolio: 117200, benchmark: 117200 },
    { label: "Jun 29", portfolio: 119100, benchmark: 118300 },
    { label: "Jul 5", portfolio: 118400, benchmark: 119000 },
    { label: "Jul 11", portfolio: 122700, benchmark: 120200 },
    { label: "Jul 17", portfolio: 123900, benchmark: 121800 },
    { label: "Jul 23", portfolio: 125448, benchmark: 122900 },
  ],
  "3M": [
    { label: "May", portfolio: 108300, benchmark: 108300 },
    { label: "May 20", portfolio: 112900, benchmark: 110400 },
    { label: "Jun", portfolio: 116500, benchmark: 112900 },
    { label: "Jun 20", portfolio: 114800, benchmark: 114100 },
    { label: "Jul", portfolio: 121600, benchmark: 116800 },
    { label: "Now", portfolio: 125448, benchmark: 119300 },
  ],
  "1Y": [
    { label: "Aug", portfolio: 92500, benchmark: 92500 },
    { label: "Oct", portfolio: 97800, benchmark: 95600 },
    { label: "Dec", portfolio: 101200, benchmark: 98900 },
    { label: "Feb", portfolio: 107400, benchmark: 102800 },
    { label: "Apr", portfolio: 113900, benchmark: 107600 },
    { label: "Now", portfolio: 125448, benchmark: 112900 },
  ],
};

const performancePeriods: PerformancePeriod[] = ["1M", "3M", "1Y"];

type NavigationItem = {
  label: string;
  icon: IconComponent;
  active?: boolean;
};

const navigationItems: NavigationItem[] = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Portfolio", icon: LuBriefcaseBusiness },
  { label: "Accounts", icon: LuWalletCards },
  { label: "Transactions", icon: LuArrowLeftRight },
  { label: "Allocation", icon: LuChartPie },
  { label: "Performance", icon: LuChartNoAxesCombined },
  { label: "Reports", icon: FileText },
];

const riskSignals: { label: string; description: string; value: string; tone: BadgeTone }[] = [
  {
    label: "Liquid assets",
    description: "Cash and same-day reserves",
    value: "45.4%",
    tone: "success",
  },
  {
    label: "Diversified exposure",
    description: "Funds and fixed income",
    value: "43.4%",
    tone: "info",
  },
  {
    label: "High-volatility exposure",
    description: "Digital asset reserve",
    value: "11.2%",
    tone: "warning",
  },
];

type DonutSegment = {
  color: string;
  label: string;
  value: number;
};

const allocationSegments: DonutSegment[] = holdings.map((holding, index) => ({
  color: `var(--n-chart-categorical-${index + 1})`,
  label: holding.name,
  value: holding.allocation,
}));

const riskSegments: DonutSegment[] = [
  { color: "var(--n-chart-categorical-3)", label: "Liquid assets", value: 45.4 },
  { color: "var(--n-chart-categorical-2)", label: "Diversified exposure", value: 43.4 },
  { color: "var(--n-chart-categorical-4)", label: "High-volatility exposure", value: 11.2 },
];

const upcomingMovements: {
  title: string;
  description: string;
  amount: string;
  status: string;
  tone: BadgeTone;
}[] = [
  {
    title: "Vendor payout",
    description: "Operating cash · Aug 12",
    amount: "-$12,400",
    status: "Scheduled",
    tone: "warning",
  },
  {
    title: "Treasury maturity",
    description: "USTX · Aug 14",
    amount: "+$5,000",
    status: "Expected",
    tone: "info",
  },
  {
    title: "Client settlement",
    description: "Operating cash · Aug 16",
    amount: "+$8,400",
    status: "Expected",
    tone: "success",
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const priceCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const runtimeLabel = (value: string) => `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}`;

function SensitiveValue({ children, visible }: { children: React.ReactNode; visible: boolean }) {
  return (
    <span
      aria-hidden={visible ? undefined : true}
      className={`${styles["private-value"]} ${visible ? "" : styles["masked-value"]}`}
      data-private-state={visible ? "visible" : "masked"}
      data-private-value
    >
      {children}
    </span>
  );
}

function subscribeToMobileViewport(callback: () => void) {
  const media = window.matchMedia("(max-width: 980px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function useMobileViewport() {
  return React.useSyncExternalStore(
    subscribeToMobileViewport,
    () => window.matchMedia("(max-width: 980px)").matches,
    () => false,
  );
}

const themeOptions = themes.map((value) => ({ label: runtimeLabel(value), value }));
const modeOptions = modes.map((value) => ({ label: runtimeLabel(value), value }));
const densityOptions = densities.map((value) => ({ label: runtimeLabel(value), value }));

function FinanceNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Finance workspace">
      {navigationItems.map((item) => {
        const active = "active" in item && item.active;
        return (
          <SidebarMenuButton
            key={item.label}
            aria-current={active ? "page" : undefined}
            className={styles["navigation-item"]}
            collapsedTooltip={item.label}
            data-state={active ? "active" : "inactive"}
            leadingIcon={item.icon}
            nativeButton={false}
            render={<span />}
            size="sm"
            variant={active ? "secondary" : "ghost"}
          >
            {item.label}
          </SidebarMenuButton>
        );
      })}
    </nav>
  );
}

type PreviewSettingsProps = {
  density: Appearance["density"];
  direction: "ltr" | "rtl";
  mode: Appearance["mode"];
  theme: Appearance["theme"];
  onDensityChange: (value: string) => void;
  onDirectionChange: (value: "ltr" | "rtl") => void;
  onModeChange: (value: string) => void;
  onThemeChange: (value: string) => void;
};

function PreviewSettings({
  density,
  direction,
  mode,
  theme,
  onDensityChange,
  onDirectionChange,
  onModeChange,
  onThemeChange,
}: PreviewSettingsProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <SidebarMenuButton
            aria-label="Open preview settings"
            className={styles["navigation-settings"]}
            collapsedTooltip="Settings"
            leadingIcon={Settings}
            size="sm"
            variant="ghost"
          >
            Settings
          </SidebarMenuButton>
        }
      />
      <SheetContent side={direction === "rtl" ? "left" : "right"} size="sm">
        <SheetHeader>
          <SheetTitle>Preview settings</SheetTitle>
          <SheetDescription>
            Inspect the same static finance workspace across supported runtime axes.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div className={styles["settings-controls"]}>
            <Select
              label="Theme"
              value={theme}
              onValueChange={onThemeChange}
              options={themeOptions}
            />
            <Select label="Mode" value={mode} onValueChange={onModeChange} options={modeOptions} />
            <Select
              label="Density"
              value={density}
              onValueChange={onDensityChange}
              options={densityOptions}
            />
            <Select
              label="Direction"
              value={direction}
              onValueChange={(value) => {
                if (value === "ltr" || value === "rtl") onDirectionChange(value);
              }}
              options={[
                { label: "Left to right", value: "ltr" },
                { label: "Right to left", value: "rtl" },
              ]}
            />
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

export function FinanceAssetsView() {
  return <FinanceAssets />;
}

function FinanceAssets() {
  const [balancesVisible, setBalancesVisible] = React.useState(true);
  const [selectedAssetId, setSelectedAssetId] = React.useState("index");
  const [period, setPeriod] = React.useState<PerformancePeriod>("1M");
  const [transferOpen, setTransferOpen] = React.useState(false);
  const [theme, setThemeValue] = React.useState<Appearance["theme"]>(defaultAppearance.theme);
  const [mode, setModeValue] = React.useState<Appearance["mode"]>(defaultAppearance.mode);
  const [density, setDensityValue] = React.useState<Appearance["density"]>(
    defaultAppearance.density,
  );
  const [direction, setDirection] = React.useState<"ltr" | "rtl">("ltr");
  const isMobile = useMobileViewport();
  const selectedAsset =
    holdings.find((holding) => holding.id === selectedAssetId) ?? defaultHolding;

  React.useLayoutEffect(() => {
    const root = document.documentElement;
    const initialDirection = root.getAttribute("dir");
    const restoreAppearance = captureAppearanceAttributes(root);
    const restored = readAppearanceFromRoot(root);
    setThemeValue(restored.theme);
    setModeValue(restored.mode);
    setDensityValue(restored.density);

    return () => {
      restoreAppearance();
      if (initialDirection) root.setAttribute("dir", initialDirection);
      else root.removeAttribute("dir");
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
  }, [direction]);

  const setTheme = (value: string) => {
    const nextTheme = themes.find((candidate) => candidate === value);
    if (!nextTheme) return;
    setThemeValue(nextTheme);
    applyAppearanceAxis(document.documentElement, "theme", nextTheme);
  };
  const setMode = (value: string) => {
    const nextMode = modes.find((candidate) => candidate === value);
    if (!nextMode) return;
    setModeValue(nextMode);
    applyAppearanceAxis(document.documentElement, "mode", nextMode);
  };
  const setDensity = (value: string) => {
    const nextDensity = densities.find((candidate) => candidate === value);
    if (!nextDensity) return;
    setDensityValue(nextDensity);
    applyAppearanceAxis(document.documentElement, "density", nextDensity);
  };

  return (
    <SidebarProvider
      className={`${styles.shell} n-typography-system`}
      direction={direction}
      side={direction === "rtl" ? "right" : "left"}
      sidebarId="finance-sidebar"
    >
      {!isMobile ? (
        <Sidebar aria-label="Finance sidebar">
          <SidebarHeader>
            <div className={styles.brand}>
              <span aria-hidden>
                <Boxes />
              </span>
              <strong>Northstar Assets</strong>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <FinanceNavigation />
          </SidebarContent>
          <SidebarFooter>
            <PreviewSettings
              density={density}
              direction={direction}
              mode={mode}
              theme={theme}
              onDensityChange={setDensity}
              onDirectionChange={setDirection}
              onModeChange={setMode}
              onThemeChange={setTheme}
            />
          </SidebarFooter>
          <SidebarRail
            collapseLabel="Collapse sidebar"
            expandLabel="Expand sidebar"
            label="Toggle sidebar"
          />
        </Sidebar>
      ) : null}

      <SidebarInset
        className={`${styles.main} ${templateLayoutStyles["content-frame"]}`}
        data-template-content
      >
        <header className={styles.topbar}>
          <div className={styles["topbar-title"]}>
            {isMobile ? (
              <Sheet>
                <Tooltip label="Open finance navigation">
                  <SheetTrigger
                    render={
                      <Button
                        icon={PanelLeft}
                        aria-label="Open finance navigation"
                        tooltip={false}
                        variant="secondary"
                      />
                    }
                  />
                </Tooltip>
                <SheetContent side={direction === "rtl" ? "right" : "left"} size="sm">
                  <SheetHeader>
                    <SheetTitle>Finance navigation</SheetTitle>
                    <SheetDescription>Move between portfolio areas.</SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    <div className={styles["mobile-navigation"]}>
                      <FinanceNavigation />
                      <PreviewSettings
                        density={density}
                        direction={direction}
                        mode={mode}
                        theme={theme}
                        onDensityChange={setDensity}
                        onDirectionChange={setDirection}
                        onModeChange={setMode}
                        onThemeChange={setTheme}
                      />
                    </div>
                  </SheetBody>
                </SheetContent>
              </Sheet>
            ) : null}
            <div>
              <p>Northstar Assets</p>
              <h1>Overview</h1>
            </div>
          </div>
          <div className={styles.actions}>
            <Tooltip label={balancesVisible ? "Hide balances" : "Show balances"}>
              <Toggle
                icon={balancesVisible ? LuEye : LuEyeOff}
                aria-label={balancesVisible ? "Hide balances" : "Show balances"}
                pressed={balancesVisible}
                variant="outline"
                onPressedChange={setBalancesVisible}
              />
            </Tooltip>
            {isMobile ? (
              <Tooltip label="Open finance template in GitHub">
                <Button
                  aria-label="Open finance template in GitHub"
                  icon={Github}
                  nativeButton={false}
                  render={<a href={financeTemplateSourceUrl} rel="noreferrer" target="_blank" />}
                  tooltip={false}
                  variant="secondary"
                />
              </Tooltip>
            ) : (
              <Button
                leadingIcon={Github}
                nativeButton={false}
                render={<a href={financeTemplateSourceUrl} rel="noreferrer" target="_blank" />}
                variant="secondary"
              >
                Open in GitHub
              </Button>
            )}
            <Dialog
              open={transferOpen}
              onOpenChange={setTransferOpen}
              trigger={
                isMobile ? (
                  <Button
                    icon={ArrowRight}
                    aria-label="Transfer"
                    tooltip="Transfer"
                    onClick={() => setTransferOpen(true)}
                  />
                ) : (
                  <Button leadingIcon={ArrowRight} onClick={() => setTransferOpen(true)}>
                    Transfer
                  </Button>
                )
              }
              title="Transfer preview"
              description="Review a static transfer example without moving funds."
            >
              <Alert tone="info" title="Demonstration only">
                This preview shows the information hierarchy of a financial transfer. No account
                data changes.
              </Alert>
              <div className={styles["transfer-route"]}>
                <KeyValue label="From" value="Operating cash · USD" />
                <ArrowRight aria-hidden />
                <KeyValue label="To" value="Short treasury fund · USTX" />
              </div>
              <div className={styles["review-grid"]}>
                <KeyValue label="Amount" value="$5,000.00" />
                <KeyValue label="Estimated arrival" value="Aug 14" />
              </div>
              <DialogFooter>
                <Button onClick={() => setTransferOpen(false)}>Done</Button>
              </DialogFooter>
            </Dialog>
          </div>
        </header>

        <Overview
          balancesVisible={balancesVisible}
          period={period}
          selectedAsset={selectedAsset}
          onPeriodChange={setPeriod}
          onSelectAsset={setSelectedAssetId}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}

function Overview({
  balancesVisible,
  period,
  selectedAsset,
  onPeriodChange,
  onSelectAsset,
}: {
  balancesVisible: boolean;
  period: PerformancePeriod;
  selectedAsset: Holding;
  onPeriodChange: (period: PerformancePeriod) => void;
  onSelectAsset: (id: string) => void;
}) {
  const currentPerformance = performanceByPeriod[period];
  const firstPerformance = currentPerformance[0];
  const latestPerformance = currentPerformance[currentPerformance.length - 1];

  return (
    <main className={styles.content}>
      <Card className={styles["balance-hero"]} aria-labelledby="portfolio-heading">
        <CardContent className={styles["balance-content"]}>
          <div className={styles["balance-copy"]}>
            <p id="portfolio-heading">Consolidated portfolio</p>
            <div
              aria-label={balancesVisible ? undefined : "Balance hidden"}
              className={`${styles["balance-value"]} ${styles["private-value"]} ${balancesVisible ? "" : styles["masked-value"]}`}
              data-private-state={balancesVisible ? "visible" : "masked"}
              data-private-value
            >
              {currency.format(125448)}
            </div>
            <div
              className={styles["balance-trend"]}
              aria-label={
                balancesVisible
                  ? "Portfolio increased by 3.8 percent and 4,612 dollars over the selected period"
                  : "Portfolio increased by 3.8 percent; monetary change hidden"
              }
            >
              <ArrowUp aria-hidden /> 3.8% ·
              <SensitiveValue visible={balancesVisible}>+$4,612</SensitiveValue>
            </div>
          </div>
          <div aria-label="Performance period" className={styles.periods} role="group">
            {performancePeriods.map((value) => (
              <Toggle
                key={value}
                pressed={period === value}
                size="sm"
                variant="outline"
                onPressedChange={(pressed) => {
                  if (pressed) onPeriodChange(value);
                }}
              >
                {value}
              </Toggle>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className={styles["stat-grid"]} aria-label="Portfolio summary">
        <Stat
          className={`${styles["private-stat"]} ${balancesVisible ? "" : styles["masked-stat"]}`}
          data-private-state={balancesVisible ? "visible" : "masked"}
          label="Available cash"
          value={currency.format(42850)}
          trend="34.2% allocation"
        />
        <Stat
          className={`${styles["private-stat"]} ${balancesVisible ? "" : styles["masked-stat"]}`}
          data-private-state={balancesVisible ? "visible" : "masked"}
          label="Invested assets"
          value={currency.format(82598)}
          trend="Across 3 positions"
        />
        <Stat
          className={`${styles["private-stat"]} ${balancesVisible ? "" : styles["masked-stat"]}`}
          data-private-state={balancesVisible ? "visible" : "masked"}
          label="Pending movement"
          value={currency.format(5000)}
          trend="1 transfer pending"
        />
        <Stat
          className={`${styles["private-stat"]} ${styles["positive-stat"]} ${balancesVisible ? "" : styles["masked-stat"]}`}
          data-private-state={balancesVisible ? "visible" : "masked"}
          label="Net cash flow"
          value={currency.format(7270)}
          trend="+$2,150 this month"
        />
      </section>

      <section className={styles["full-width-section"]} aria-label="Portfolio performance">
        <Card className={`${styles.panel} ${styles["chart-panel"]}`}>
          <CardHeader>
            <div>
              <CardTitle>Portfolio performance</CardTitle>
              <CardDescription>{period} closing values compared with benchmark.</CardDescription>
            </div>
            <CardAction className={styles["performance-badges"]}>
              <Badge tone="success">Portfolio +3.8%</Badge>
              <Badge>Benchmark +2.1%</Badge>
            </CardAction>
          </CardHeader>
          <div
            className={`${styles.chart} ${styles["private-chart"]} ${balancesVisible ? "" : styles["chart-masked"]}`}
            role="img"
            aria-label={
              balancesVisible && firstPerformance && latestPerformance
                ? `Portfolio value chart for ${period}, rising from ${currency.format(firstPerformance.portfolio)} to ${currency.format(latestPerformance.portfolio)} and outperforming its benchmark`
                : `Portfolio and benchmark chart for ${period}. Values hidden.`
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={currentPerformance}
                margin={{ top: 12, right: 8, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id="finance-chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--n-chart-primary)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--n-chart-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--n-color-border-subtle)" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--n-color-text-tertiary)",
                    fontSize: "var(--n-font-size-xs)",
                  }}
                />
                <YAxis
                  axisLine={false}
                  domain={["dataMin - 2500", "dataMax + 1500"]}
                  tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
                  tickLine={false}
                  tick={{
                    fill: "var(--n-color-text-tertiary)",
                    fontSize: "var(--n-font-size-xs)",
                  }}
                  width={48}
                />
                <ChartTooltip
                  formatter={(value, name) => [
                    currency.format(Number(value)),
                    name === "portfolio" ? "Portfolio" : "Benchmark",
                  ]}
                  contentStyle={{
                    background: "var(--n-color-surface)",
                    border: "1px solid var(--n-color-border-subtle)",
                    borderRadius: "var(--n-radius-md)",
                    color: "var(--n-color-text-primary)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  fill="transparent"
                  isAnimationActive={false}
                  stroke="var(--n-color-text-tertiary)"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="portfolio"
                  fill="url(#finance-chart-fill)"
                  isAnimationActive={false}
                  stroke="var(--n-chart-primary)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className={styles["insight-grid"]} aria-label="Portfolio exposure insights">
        <AssetDetail asset={selectedAsset} balancesVisible={balancesVisible} />
        <Card className={styles.panel}>
          <CardHeader>
            <div>
              <CardTitle>Risk and diversification</CardTitle>
              <CardDescription>Current exposure across the consolidated portfolio.</CardDescription>
            </div>
            <CardAction>
              <Badge leadingIcon={CircleAlert} tone="info">
                Balanced
              </Badge>
            </CardAction>
          </CardHeader>
          <div className={styles["risk-visual"]}>
            <DonutChart
              ariaLabel="Risk distribution: 45.4 percent liquid assets, 43.4 percent diversified exposure, and 11.2 percent high-volatility exposure"
              centerLabel="Total exposure"
              centerValue="100%"
              segments={riskSegments}
            />
            <ItemGroup aria-label="Portfolio risk signals" className={styles["risk-list"]}>
              {riskSignals.map((signal) => (
                <Item key={signal.label} size="sm">
                  <ItemContent>
                    <ItemTitle>{signal.label}</ItemTitle>
                    <ItemDescription>{signal.description}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge tone={signal.tone}>{signal.value}</Badge>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </div>
        </Card>
      </section>

      <section className={styles["full-width-section"]} aria-label="Portfolio allocation">
        <Card className={styles.panel}>
          <CardHeader>
            <div>
              <CardTitle>Allocation</CardTitle>
              <CardDescription>Select an asset to inspect its exposure.</CardDescription>
            </div>
            <CardAction>
              <Badge>4 assets</Badge>
            </CardAction>
          </CardHeader>
          <div className={styles["allocation-visual"]}>
            <DonutChart
              ariaLabel="Portfolio allocation: 34.2 percent operating cash, 35.8 percent global index fund, 18.8 percent short treasury fund, and 11.2 percent digital asset reserve"
              centerLabel="Allocated"
              centerValue="100%"
              segments={allocationSegments}
            />
            <ItemGroup aria-label="Portfolio allocation" className={styles["allocation-list"]}>
              {holdings.map((holding, index) => (
                <Item
                  key={holding.id}
                  data-selected={selectedAsset.id === holding.id ? "" : undefined}
                  onClick={() => onSelectAsset(holding.id)}
                  render={<button type="button" />}
                  size="sm"
                  variant={selectedAsset.id === holding.id ? "soft" : "plain"}
                >
                  <ItemMedia>
                    <span
                      aria-hidden
                      className={styles["legend-swatch"]}
                      style={{ background: allocationSegments[index]?.color }}
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{holding.name}</ItemTitle>
                    <ItemDescription>{holding.symbol}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <span className={styles["numeric-value"]}>{holding.allocation}%</span>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </div>
        </Card>
      </section>

      <section className={styles["activity-grid"]} aria-label="Portfolio cash movements">
        <Card className={styles.panel}>
          <CardHeader>
            <div>
              <CardTitle>Upcoming cash movements</CardTitle>
              <CardDescription>Expected settlements and scheduled obligations.</CardDescription>
            </div>
            <CardAction>
              <Badge leadingIcon={CalendarDays} tone="info">
                Next 7 days
              </Badge>
            </CardAction>
          </CardHeader>
          <ItemGroup aria-label="Upcoming cash movements" className={styles["movement-list"]}>
            {upcomingMovements.map((movement, index) => (
              <React.Fragment key={movement.title}>
                {index > 0 ? <ItemSeparator /> : null}
                <Item>
                  <ItemContent>
                    <ItemTitle>{movement.title}</ItemTitle>
                    <ItemDescription>{movement.description}</ItemDescription>
                  </ItemContent>
                  <ItemActions className={styles["movement-actions"]}>
                    <span>{movement.amount}</span>
                    <Badge tone={movement.tone}>{movement.status}</Badge>
                  </ItemActions>
                </Item>
              </React.Fragment>
            ))}
          </ItemGroup>
        </Card>

        <Card className={styles.panel}>
          <CardHeader>
            <div>
              <CardTitle>Recent movement</CardTitle>
              <CardDescription>Latest completed and pending portfolio activity.</CardDescription>
            </div>
          </CardHeader>
          <TransactionList
            balancesVisible={balancesVisible}
            transactions={transactions.slice(0, 3)}
          />
        </Card>
      </section>
    </main>
  );
}

function AssetDetail({ asset, balancesVisible }: { asset: Holding; balancesVisible: boolean }) {
  return (
    <Card className={styles.panel}>
      <CardHeader>
        <div>
          <CardTitle>Selected asset</CardTitle>
          <CardDescription>Position detail within the consolidated account.</CardDescription>
        </div>
        <CardAction>
          <Badge>{asset.type}</Badge>
        </CardAction>
      </CardHeader>
      <Item size="lg" variant="soft">
        <ItemMedia variant="icon">
          <Icon icon={Boxes} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{asset.name}</ItemTitle>
          <ItemDescription>{asset.symbol} · Consolidated account</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Movement value={asset.movement} />
        </ItemActions>
      </Item>
      <div className={styles["detail-grid"]}>
        <KeyValue
          label="Current value"
          value={
            <SensitiveValue visible={balancesVisible}>
              {currency.format(asset.value)}
            </SensitiveValue>
          }
        />
        <KeyValue label="Allocation" value={`${asset.allocation}%`} />
        <KeyValue label="Reference price" value={priceCurrency.format(asset.price)} />
        <KeyValue label="Volatility" value={asset.volatility} />
        <KeyValue label="Liquidity" value={asset.liquidity} />
      </div>
    </Card>
  );
}

function transactionTone(status: TransactionStatus): BadgeTone {
  if (status === "Completed") return "success";
  if (status === "Failed") return "danger";
  return "info";
}

function TransactionList({
  transactions: items,
  balancesVisible,
}: {
  transactions: typeof transactions;
  balancesVisible: boolean;
}) {
  return (
    <ItemGroup aria-label="Recent portfolio movement" className={styles["movement-list"]}>
      {items.map((transaction, index) => {
        const TransactionIcon =
          transaction.kind === "Incoming"
            ? ArrowLeft
            : transaction.kind === "Outgoing"
              ? ArrowRight
              : ArrowRight;
        return (
          <React.Fragment key={transaction.id}>
            {index > 0 ? <ItemSeparator /> : null}
            <Item>
              <ItemMedia variant="icon">
                <Icon icon={TransactionIcon} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{transaction.title}</ItemTitle>
                <ItemDescription>
                  {transaction.detail} · {transaction.date}
                </ItemDescription>
              </ItemContent>
              <ItemActions className={styles["movement-actions"]}>
                <SensitiveValue visible={balancesVisible}>
                  {currency.format(transaction.amount)}
                </SensitiveValue>
                <Badge
                  leadingIcon={transaction.status === "Completed" ? Check : undefined}
                  tone={transactionTone(transaction.status)}
                >
                  {transaction.status}
                </Badge>
              </ItemActions>
            </Item>
          </React.Fragment>
        );
      })}
    </ItemGroup>
  );
}

function DonutChart({
  ariaLabel,
  centerLabel,
  centerValue,
  segments,
}: {
  ariaLabel: string;
  centerLabel: string;
  centerValue: string;
  segments: DonutSegment[];
}) {
  let offset = 0;
  const segmentGap = 5;

  return (
    <div className={styles["donut-chart"]} role="img" aria-label={ariaLabel}>
      <svg aria-hidden viewBox="0 0 100 100">
        <circle className={styles["donut-track"]} cx="50" cy="50" r="38" pathLength="100" />
        {segments.map((segment) => {
          const visibleValue = Math.max(segment.value - segmentGap, 0);
          const dashOffset = -(offset + segmentGap / 2);
          offset += segment.value;
          return (
            <circle
              key={segment.label}
              className={styles["donut-segment"]}
              cx="50"
              cy="50"
              r="38"
              pathLength="100"
              stroke={segment.color}
              strokeDasharray={`${visibleValue} ${100 - visibleValue}`}
              strokeDashoffset={dashOffset}
            />
          );
        })}
      </svg>
      <span className={styles["donut-center"]}>
        <span>{centerValue}</span>
        <small>{centerLabel}</small>
      </span>
    </div>
  );
}

function Movement({ value }: { value: number }) {
  if (value === 0) return <span>0.00% · unchanged</span>;
  const positive = value > 0;
  return (
    <span className={styles[positive ? "positive" : "negative"]}>
      {positive ? "↑" : "↓"} {Math.abs(value).toFixed(2)}% {positive ? "up" : "down"}
    </span>
  );
}
