"use client";

import * as React from "react";
import { densities, modes } from "@nerio-ui/tokens";
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
  Check,
  FileText,
  LayoutDashboard,
  Minus,
  Monitor,
  PanelLeft,
  Rows3,
  Search,
  Settings,
} from "@nerio-ui/adapters/icons";
import { SidebarContent, SidebarFooter, SidebarHeader, SidebarInset } from "@nerio-ui/ui";
import {
  Alert,
  Badge,
  Button,
  Card,
  Dialog,
  DialogFooter,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateTitle,
  Field,
  Input,
  KeyValue,
  Progress,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Skeleton,
  Stat,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  ToastProvider,
  ToastViewport,
  Tooltip,
  useToastManager,
} from "@nerio-ui/ui/client";
import {
  defaultAppearance,
  persistAppearanceAxis,
  readAppearanceFromRoot,
  type Appearance,
} from "../../../lib/appearance";
import styles from "./view.module.css";

type Section = "overview" | "holdings" | "transactions" | "settings";
type TransactionStatus = "Completed" | "Pending" | "Failed";

const holdings = [
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
  },
  {
    id: "index",
    name: "Global index fund",
    symbol: "NWLD",
    type: "Fund",
    quantity: 314.82,
    price: 142.67,
    allocation: 35.8,
    movement: 1.24,
    value: 44917,
  },
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
  },
] as const;

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

const performanceByPeriod = {
  "1M": [
    { label: "Jun 23", value: 117200 },
    { label: "Jun 29", value: 119100 },
    { label: "Jul 5", value: 118400 },
    { label: "Jul 11", value: 122700 },
    { label: "Jul 17", value: 123900 },
    { label: "Jul 23", value: 125448 },
  ],
  "3M": [
    { label: "May", value: 108300 },
    { label: "May 20", value: 112900 },
    { label: "Jun", value: 116500 },
    { label: "Jun 20", value: 114800 },
    { label: "Jul", value: 121600 },
    { label: "Now", value: 125448 },
  ],
  "1Y": [
    { label: "Aug", value: 92500 },
    { label: "Oct", value: 97800 },
    { label: "Dec", value: 101200 },
    { label: "Feb", value: 107400 },
    { label: "Apr", value: 113900 },
    { label: "Now", value: 125448 },
  ],
} as const;

const navItems = [
  ["overview", "Overview", LayoutDashboard],
  ["holdings", "Holdings", Rows3],
  ["transactions", "Transactions", FileText],
  ["settings", "Settings", Settings],
] as const;

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
const quantity = new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 });

const maskedValue = "Balance hidden";
const displayMoney = (value: number, visible: boolean) =>
  visible ? currency.format(value) : maskedValue;
const runtimeLabel = (value: string) => `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}`;

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

function FinanceNavigation({
  active,
  onSelect,
}: {
  active: Section;
  onSelect: (section: Section) => void;
}) {
  return (
    <nav className={styles.navigation} aria-label="Finance workspace">
      {navItems.map(([value, label, icon]) => (
        <Button
          key={value}
          aria-current={active === value ? "page" : undefined}
          className={styles["navigation-item"]}
          data-state={active === value ? "active" : "inactive"}
          leadingIcon={icon}
          size="sm"
          variant={active === value ? "secondary" : "ghost"}
          onClick={() => onSelect(value)}
        >
          {label}
        </Button>
      ))}
    </nav>
  );
}

export function FinanceAssetsView() {
  return (
    <ToastProvider>
      <FinanceAssets />
      <ToastViewport swipeDirection={["inline-end", "down"]} />
    </ToastProvider>
  );
}

function FinanceAssets() {
  const [section, setSection] = React.useState<Section>("overview");
  const [balancesVisible, setBalancesVisible] = React.useState(true);
  const [selectedAssetId, setSelectedAssetId] = React.useState("index");
  const [query, setQuery] = React.useState("");
  const [assetType, setAssetType] = React.useState("all");
  const [transactionStatus, setTransactionStatus] = React.useState("all");
  const [period, setPeriod] = React.useState<keyof typeof performanceByPeriod>("1M");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [transferOpen, setTransferOpen] = React.useState(false);
  const [transferStep, setTransferStep] = React.useState<
    "details" | "review" | "submitting" | "success"
  >("details");
  const [amount, setAmount] = React.useState("");
  const [amountError, setAmountError] = React.useState("");
  const transferTimerRef = React.useRef<number | null>(null);
  const [mode, setModeValue] = React.useState<Appearance["mode"]>(defaultAppearance.mode);
  const [density, setDensityValue] = React.useState<Appearance["density"]>(
    defaultAppearance.density,
  );
  const [direction, setDirection] = React.useState("ltr");
  const isMobile = useMobileViewport();
  const toasts = useToastManager();
  const selectedAsset = holdings.find((holding) => holding.id === selectedAssetId) ?? holdings[0];

  React.useLayoutEffect(() => {
    const root = document.documentElement;
    const initialDirection = root.getAttribute("dir");
    const restored = readAppearanceFromRoot(root);
    setModeValue(restored.mode);
    setDensityValue(restored.density);

    return () => {
      if (initialDirection) root.setAttribute("dir", initialDirection);
      else root.removeAttribute("dir");
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
  }, [direction]);

  React.useEffect(
    () => () => {
      if (transferTimerRef.current !== null) {
        window.clearTimeout(transferTimerRef.current);
      }
    },
    [],
  );

  const visibleHoldings = holdings.filter((holding) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      holding.name.toLowerCase().includes(normalizedQuery) ||
      holding.symbol.toLowerCase().includes(normalizedQuery);
    return matchesQuery && (assetType === "all" || holding.type === assetType);
  });
  const visibleTransactions = transactions.filter(
    (transaction) => transactionStatus === "all" || transaction.status === transactionStatus,
  );

  const selectSection = (nextSection: Section) => {
    setSection(nextSection);
    setMobileNavOpen(false);
    if (isMobile) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setMode = (value: string) => {
    const nextMode = modes.find((candidate) => candidate === value);
    if (!nextMode) return;
    setModeValue(nextMode);
    persistAppearanceAxis(document.documentElement, "mode", nextMode);
  };
  const setDensity = (value: string) => {
    const nextDensity = densities.find((candidate) => candidate === value);
    if (!nextDensity) return;
    setDensityValue(nextDensity);
    persistAppearanceAxis(document.documentElement, "density", nextDensity);
  };

  const resetTransfer = () => {
    if (transferTimerRef.current !== null) {
      window.clearTimeout(transferTimerRef.current);
      transferTimerRef.current = null;
    }
    setTransferStep("details");
    setAmount("");
    setAmountError("");
  };
  const reviewTransfer = () => {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setAmountError("Enter an amount greater than zero.");
      return;
    }
    if (parsed > 42850) {
      setAmountError("Amount exceeds the available cash balance.");
      return;
    }
    setAmountError("");
    setTransferStep("review");
  };
  const submitTransfer = () => {
    setTransferStep("submitting");
    transferTimerRef.current = window.setTimeout(() => {
      transferTimerRef.current = null;
      setTransferStep("success");
    }, 700);
  };

  return (
    <SidebarProvider className={`${styles.shell} n-typography-system`} sidebarId="finance-sidebar">
      {!isMobile ? (
        <Sidebar aria-label="Finance sidebar">
          <SidebarHeader>
            <div className={styles.brand}>
              <span aria-hidden>
                <Boxes />
              </span>
              <div>
                <strong>Northstar Assets</strong>
                <small>Consolidated portfolio</small>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <FinanceNavigation active={section} onSelect={selectSection} />
          </SidebarContent>
          <SidebarFooter>
            <div className={styles["security-note"]}>
              <Check aria-hidden />
              <p>
                <strong>Protected workspace</strong>
                <span>Last verified today at 09:30</span>
              </p>
            </div>
          </SidebarFooter>
          <SidebarRail label="Toggle finance sidebar" />
        </Sidebar>
      ) : null}

      <SidebarInset className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles["topbar-title"]}>
            {isMobile ? (
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
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
                <SheetContent side="left" size="sm">
                  <SheetHeader>
                    <SheetTitle>Finance navigation</SheetTitle>
                    <SheetDescription>Move between portfolio areas.</SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    <FinanceNavigation active={section} onSelect={selectSection} />
                  </SheetBody>
                </SheetContent>
              </Sheet>
            ) : (
              <SidebarTrigger label="Toggle finance sidebar" />
            )}
            <div>
              <p>Northstar Assets</p>
              <h1>{navItems.find(([value]) => value === section)?.[1]}</h1>
            </div>
          </div>
          <div className={styles.actions}>
            <Button
              icon={balancesVisible ? Minus : Monitor}
              aria-label={balancesVisible ? "Hide balances" : "Show balances"}
              tooltip={balancesVisible ? "Hide balances" : "Show balances"}
              variant="secondary"
              onClick={() => setBalancesVisible((visible) => !visible)}
            />
            <Dialog
              open={transferOpen}
              onOpenChange={(open) => {
                setTransferOpen(open);
                if (!open) resetTransfer();
              }}
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
              title={
                transferStep === "success"
                  ? "Transfer scheduled"
                  : transferStep === "review"
                    ? "Review transfer"
                    : "New transfer"
              }
              description="A deterministic local flow. No funds will move."
            >
              {transferStep === "details" ? (
                <>
                  <div className={styles["transfer-route"]}>
                    <KeyValue label="From" value="Operating cash · USD" />
                    <ArrowRight aria-hidden />
                    <KeyValue label="To" value="Short treasury fund · USTX" />
                  </div>
                  <Field
                    label="Amount"
                    description="Available: $42,850"
                    message={amountError || undefined}
                    invalid={Boolean(amountError)}
                  >
                    <Input
                      inputMode="decimal"
                      value={amount}
                      onChange={(event) => setAmount(event.currentTarget.value)}
                      placeholder="0.00"
                      aria-invalid={Boolean(amountError)}
                    />
                  </Field>
                  <DialogFooter>
                    <Button variant="secondary" onClick={() => setTransferOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={reviewTransfer}>Review transfer</Button>
                  </DialogFooter>
                </>
              ) : null}
              {transferStep === "review" ? (
                <>
                  <Alert tone="info" title="Review before confirming">
                    This mock transfer will be scheduled immediately.
                  </Alert>
                  <div className={styles["review-grid"]}>
                    <KeyValue label="Amount" value={priceCurrency.format(Number(amount))} />
                    <KeyValue label="From" value="Operating cash" />
                    <KeyValue label="To" value="Short treasury fund" />
                    <KeyValue label="Estimated arrival" value="Today" />
                  </div>
                  <DialogFooter>
                    <Button variant="secondary" onClick={() => setTransferStep("details")}>
                      Back
                    </Button>
                    <Button onClick={submitTransfer}>Confirm transfer</Button>
                  </DialogFooter>
                </>
              ) : null}
              {transferStep === "submitting" ? (
                <div className={styles["submitting-state"]} role="status">
                  <Skeleton />
                  <Skeleton />
                  <p>Scheduling transfer…</p>
                </div>
              ) : null}
              {transferStep === "success" ? (
                <>
                  <Alert tone="success" title="Transfer scheduled">
                    {priceCurrency.format(Number(amount))} will move to Short treasury fund.
                  </Alert>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        setTransferOpen(false);
                        toasts.add({
                          title: "Transfer scheduled",
                          description: "The local transaction now appears as pending.",
                          data: { tone: "success" },
                        });
                      }}
                    >
                      Done
                    </Button>
                  </DialogFooter>
                </>
              ) : null}
            </Dialog>
          </div>
        </header>

        {section === "overview" ? (
          <Overview
            balancesVisible={balancesVisible}
            period={period}
            selectedAsset={selectedAsset}
            onPeriodChange={setPeriod}
            onSelectAsset={setSelectedAssetId}
            onOpenHoldings={() => setSection("holdings")}
          />
        ) : null}
        {section === "holdings" ? (
          <Holdings
            balancesVisible={balancesVisible}
            assetType={assetType}
            query={query}
            selectedAsset={selectedAsset}
            visibleHoldings={visibleHoldings}
            onAssetTypeChange={setAssetType}
            onQueryChange={setQuery}
            onSelectAsset={setSelectedAssetId}
            onReset={() => {
              setQuery("");
              setAssetType("all");
            }}
          />
        ) : null}
        {section === "transactions" ? (
          <Transactions
            balancesVisible={balancesVisible}
            status={transactionStatus}
            transactions={visibleTransactions}
            onStatusChange={setTransactionStatus}
          />
        ) : null}
        {section === "settings" ? (
          <SettingsPanel
            balancesVisible={balancesVisible}
            density={density}
            direction={direction}
            mode={mode}
            onBalancesVisibleChange={setBalancesVisible}
            onDensityChange={setDensity}
            onDirectionChange={setDirection}
            onModeChange={setMode}
          />
        ) : null}
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
  onOpenHoldings,
}: {
  balancesVisible: boolean;
  period: keyof typeof performanceByPeriod;
  selectedAsset: (typeof holdings)[number];
  onPeriodChange: (period: keyof typeof performanceByPeriod) => void;
  onSelectAsset: (id: string) => void;
  onOpenHoldings: () => void;
}) {
  const currentPerformance = performanceByPeriod[period];

  return (
    <main className={styles.content}>
      <section className={styles["balance-hero"]} aria-labelledby="portfolio-heading">
        <div>
          <p>Consolidated portfolio</p>
          <h2 id="portfolio-heading">{displayMoney(125448, balancesVisible)}</h2>
          <span
            aria-label={
              balancesVisible
                ? "Portfolio increased by 3.8 percent and 4,612 dollars over the selected period"
                : "Portfolio increased by 3.8 percent; monetary change hidden"
            }
          >
            <ArrowUp aria-hidden /> 3.8% · {balancesVisible ? "+$4,612" : "value hidden"}
          </span>
        </div>
        <div className={styles.periods} aria-label="Performance period">
          {(["1M", "3M", "1Y"] as const).map((value) => (
            <Button
              key={value}
              aria-pressed={period === value}
              size="sm"
              variant={period === value ? "secondary" : "ghost"}
              onClick={() => onPeriodChange(value)}
            >
              {value}
            </Button>
          ))}
        </div>
      </section>

      <section className={styles["stat-grid"]} aria-label="Portfolio summary">
        <Stat
          label="Available cash"
          value={displayMoney(42850, balancesVisible)}
          trend="34.2% allocation"
        />
        <Stat
          label="Invested assets"
          value={displayMoney(82598, balancesVisible)}
          trend="Across 3 positions"
        />
        <Stat
          label="Pending movement"
          value={displayMoney(5000, balancesVisible)}
          trend="1 transfer pending"
        />
      </section>

      <section className={styles["overview-grid"]}>
        <Card className={`${styles.panel} ${styles["chart-panel"]}`}>
          <div className={styles["panel-heading"]}>
            <div>
              <h2>Portfolio movement</h2>
              <p>{period} closing values in USD</p>
            </div>
            <Badge variant="success">Up 3.8%</Badge>
          </div>
          <div
            className={styles.chart}
            role="img"
            aria-label={
              balancesVisible
                ? `Portfolio value chart for ${period}, rising from ${currency.format(currentPerformance[0]?.value ?? 0)} to ${currency.format(currentPerformance.at(-1)?.value ?? 0)}`
                : `Portfolio value chart for ${period}. Values hidden.`
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[...currentPerformance]}
                margin={{ top: 12, right: 4, bottom: 0, left: 4 }}
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
                  tick={{ fill: "var(--n-color-text-tertiary)", fontSize: 11 }}
                />
                <YAxis hide domain={["dataMin - 2500", "dataMax + 1500"]} />
                <ChartTooltip
                  formatter={(value) =>
                    balancesVisible ? currency.format(Number(value)) : maskedValue
                  }
                  contentStyle={{
                    background: "var(--n-color-surface)",
                    border: "1px solid var(--n-color-border-subtle)",
                    borderRadius: "var(--n-radius-md)",
                    color: "var(--n-color-text-primary)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--n-chart-primary)"
                  strokeWidth={2}
                  fill="url(#finance-chart-fill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.panel}>
          <div className={styles["panel-heading"]}>
            <div>
              <h2>Allocation</h2>
              <p>Select an asset for detail</p>
            </div>
            <Button size="sm" variant="ghost" onClick={onOpenHoldings}>
              View all
            </Button>
          </div>
          <div className={styles["allocation-list"]}>
            {holdings.map((holding) => (
              <button
                key={holding.id}
                className={styles["allocation-row"]}
                data-state={selectedAsset.id === holding.id ? "selected" : undefined}
                onClick={() => onSelectAsset(holding.id)}
              >
                <span>
                  {holding.name}
                  <small>{holding.symbol}</small>
                </span>
                <strong>{holding.allocation}%</strong>
                <Progress
                  value={holding.allocation}
                  aria-label={`${holding.name} ${holding.allocation}% allocation`}
                />
              </button>
            ))}
          </div>
        </Card>

        <AssetDetail asset={selectedAsset} balancesVisible={balancesVisible} />
        <Card className={styles.panel}>
          <div className={styles["panel-heading"]}>
            <div>
              <h2>Recent movement</h2>
              <p>Latest portfolio activity</p>
            </div>
          </div>
          <TransactionList
            balancesVisible={balancesVisible}
            transactions={transactions.slice(0, 3)}
          />
        </Card>
      </section>
    </main>
  );
}

function Holdings({
  balancesVisible,
  assetType,
  query,
  selectedAsset,
  visibleHoldings,
  onAssetTypeChange,
  onQueryChange,
  onSelectAsset,
  onReset,
}: {
  balancesVisible: boolean;
  assetType: string;
  query: string;
  selectedAsset: (typeof holdings)[number];
  visibleHoldings: (typeof holdings)[number][];
  onAssetTypeChange: (type: string) => void;
  onQueryChange: (query: string) => void;
  onSelectAsset: (id: string) => void;
  onReset: () => void;
}) {
  return (
    <main className={styles.content}>
      <div className={styles["section-heading"]}>
        <div>
          <p>Portfolio positions</p>
          <h2>Holdings</h2>
        </div>
        <Badge>{holdings.length} assets</Badge>
      </div>
      <section className={styles.filters} aria-label="Holdings filters">
        <Field label="Search holdings">
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.currentTarget.value)}
            placeholder="Name or symbol"
          />
        </Field>
        <Select
          label="Asset type"
          value={assetType}
          onChange={onAssetTypeChange}
          options={[
            { label: "All asset types", value: "all" },
            { label: "Cash", value: "Cash" },
            { label: "Fund", value: "Fund" },
            { label: "Fixed income", value: "Fixed income" },
            { label: "Digital asset", value: "Digital asset" },
          ]}
        />
      </section>
      {visibleHoldings.length ? (
        <>
          <Card className={styles["holdings-table-card"]}>
            <TableContainer aria-label="Portfolio holdings">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead>Daily movement</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleHoldings.map((holding) => (
                    <TableRow
                      key={holding.id}
                      className={styles["holding-row"]}
                      data-state={selectedAsset.id === holding.id ? "selected" : undefined}
                      tabIndex={0}
                      onClick={() => onSelectAsset(holding.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelectAsset(holding.id);
                        }
                      }}
                    >
                      <TableCell>
                        <strong>{holding.name}</strong>
                        <small>
                          {holding.symbol} · {holding.type}
                        </small>
                      </TableCell>
                      <TableCell className={styles.numeric}>
                        {quantity.format(holding.quantity)}
                      </TableCell>
                      <TableCell className={styles.numeric}>
                        {priceCurrency.format(holding.price)}
                      </TableCell>
                      <TableCell className={styles.numeric}>{holding.allocation}%</TableCell>
                      <TableCell className={styles.numeric}>
                        <Movement value={holding.movement} />
                      </TableCell>
                      <TableCell className={styles.numeric}>
                        <strong>{displayMoney(holding.value, balancesVisible)}</strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <div className={styles["mobile-holdings"]}>
            {visibleHoldings.map((holding) => (
              <button
                key={holding.id}
                className={styles["mobile-holding"]}
                onClick={() => onSelectAsset(holding.id)}
              >
                <span>
                  <strong>{holding.name}</strong>
                  <small>
                    {holding.symbol} · {holding.type}
                  </small>
                </span>
                <span>
                  <strong>{displayMoney(holding.value, balancesVisible)}</strong>
                  <Movement value={holding.movement} />
                </span>
              </button>
            ))}
          </div>
          <AssetDetail asset={selectedAsset} balancesVisible={balancesVisible} />
        </>
      ) : (
        <EmptyState>
          <EmptyStateHeader>
            <Search aria-hidden />
            <EmptyStateTitle>No holdings found</EmptyStateTitle>
          </EmptyStateHeader>
          <EmptyStateDescription>
            Adjust the search or asset type to see portfolio positions.
          </EmptyStateDescription>
          <EmptyStateActions>
            <Button variant="secondary" onClick={onReset}>
              Clear filters
            </Button>
          </EmptyStateActions>
        </EmptyState>
      )}
    </main>
  );
}

function Transactions({
  balancesVisible,
  status,
  transactions: visibleTransactions,
  onStatusChange,
}: {
  balancesVisible: boolean;
  status: string;
  transactions: typeof transactions;
  onStatusChange: (status: string) => void;
}) {
  return (
    <main className={styles.content}>
      <div className={styles["section-heading"]}>
        <div>
          <p>Recorded movement</p>
          <h2>Transactions</h2>
        </div>
        <Select
          label="Transaction status"
          value={status}
          onChange={onStatusChange}
          options={[
            { label: "All statuses", value: "all" },
            { label: "Completed", value: "Completed" },
            { label: "Pending", value: "Pending" },
            { label: "Failed", value: "Failed" },
          ]}
        />
      </div>
      {visibleTransactions.length ? (
        <Card className={styles.panel}>
          <TransactionList balancesVisible={balancesVisible} transactions={visibleTransactions} />
        </Card>
      ) : (
        <EmptyState>
          <EmptyStateHeader>
            <FileText aria-hidden />
            <EmptyStateTitle>No transactions in this view</EmptyStateTitle>
          </EmptyStateHeader>
          <EmptyStateDescription>
            Choose another status to inspect recorded portfolio movement.
          </EmptyStateDescription>
          <EmptyStateActions>
            <Button variant="secondary" onClick={() => onStatusChange("all")}>
              Show all
            </Button>
          </EmptyStateActions>
        </EmptyState>
      )}
    </main>
  );
}

function SettingsPanel({
  balancesVisible,
  density,
  direction,
  mode,
  onBalancesVisibleChange,
  onDensityChange,
  onDirectionChange,
  onModeChange,
}: {
  balancesVisible: boolean;
  density: string;
  direction: string;
  mode: string;
  onBalancesVisibleChange: (visible: boolean) => void;
  onDensityChange: (value: string) => void;
  onDirectionChange: (value: string) => void;
  onModeChange: (value: string) => void;
}) {
  return (
    <main className={styles.content}>
      <div className={styles["section-heading"]}>
        <div>
          <p>Security and display</p>
          <h2>Workspace settings</h2>
        </div>
        <Badge variant="success">Verified</Badge>
      </div>
      <div className={styles["settings-grid"]}>
        <Card className={styles.panel}>
          <div className={styles["panel-heading"]}>
            <div>
              <h2>Privacy</h2>
              <p>Control sensitive financial values.</p>
            </div>
          </div>
          <label className={styles["switch-row"]}>
            <span>
              <strong>Show balances</strong>
              <small>Display portfolio values throughout this browser session.</small>
            </span>
            <Switch
              checked={balancesVisible}
              onCheckedChange={onBalancesVisibleChange}
              aria-label="Show balances"
            />
          </label>
          <div className={styles["security-note"]}>
            <Check aria-hidden />
            <p>
              <strong>Recent verification</strong>
              <span>Passkey confirmed today at 09:30</span>
            </p>
          </div>
        </Card>
        <Card className={styles.panel}>
          <div className={styles["panel-heading"]}>
            <div>
              <h2>Display</h2>
              <p>Inspect canonical runtime axes.</p>
            </div>
          </div>
          <div className={styles["settings-controls"]}>
            <Select
              label="Mode"
              value={mode}
              onChange={onModeChange}
              options={modes.map((value) => ({
                label: runtimeLabel(value),
                value,
              }))}
            />
            <Select
              label="Density"
              value={density}
              onChange={onDensityChange}
              options={densities.map((value) => ({
                label: runtimeLabel(value),
                value,
              }))}
            />
            <Select
              label="Direction"
              value={direction}
              onChange={onDirectionChange}
              options={[
                { label: "Left to right", value: "ltr" },
                { label: "Right to left", value: "rtl" },
              ]}
            />
          </div>
        </Card>
        <Alert tone="warning" title="Deterministic preview">
          Security state, balances, prices, and transfers are local demonstration data. Nothing is
          persisted or sent.
        </Alert>
      </div>
    </main>
  );
}

function AssetDetail({
  asset,
  balancesVisible,
}: {
  asset: (typeof holdings)[number];
  balancesVisible: boolean;
}) {
  return (
    <Card className={`${styles.panel} ${styles["asset-detail"]}`}>
      <div className={styles["asset-identity"]}>
        <span aria-hidden>{asset.symbol.slice(0, 1)}</span>
        <div>
          <Badge>{asset.type}</Badge>
          <h2>{asset.name}</h2>
          <p>{asset.symbol} · Consolidated account</p>
        </div>
      </div>
      <div className={styles["detail-grid"]}>
        <KeyValue
          label="Current value"
          value={<strong>{displayMoney(asset.value, balancesVisible)}</strong>}
        />
        <KeyValue label="Allocation" value={`${asset.allocation}%`} />
        <KeyValue label="Reference price" value={priceCurrency.format(asset.price)} />
        <KeyValue label="Daily movement" value={<Movement value={asset.movement} />} />
      </div>
    </Card>
  );
}

function TransactionList({
  transactions: items,
  balancesVisible,
}: {
  transactions: typeof transactions;
  balancesVisible: boolean;
}) {
  return (
    <div className={styles["transaction-list"]}>
      {items.map((transaction) => {
        const TransactionIcon =
          transaction.kind === "Incoming"
            ? ArrowLeft
            : transaction.kind === "Outgoing"
              ? ArrowRight
              : ArrowRight;
        return (
          <div key={transaction.id} className={styles.transaction}>
            <span className={styles["transaction-icon"]}>
              <TransactionIcon aria-hidden />
            </span>
            <span>
              <strong>{transaction.title}</strong>
              <small>
                {transaction.detail} · {transaction.date}
              </small>
            </span>
            <span className={styles["transaction-amount"]}>
              <strong>{displayMoney(transaction.amount, balancesVisible)}</strong>
              <Badge
                variant={
                  transaction.status === "Completed"
                    ? "success"
                    : transaction.status === "Failed"
                      ? "danger"
                      : "info"
                }
              >
                {transaction.status === "Completed" ? <Check aria-hidden /> : null}
                {transaction.status}
              </Badge>
            </span>
          </div>
        );
      })}
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
