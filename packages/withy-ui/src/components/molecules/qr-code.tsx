import { encode } from "uqr";
import { CircleCheck, CircleX, RefreshCw } from "lucide-react";
import { Button } from "../atoms/button";
import { Icon } from "../atoms/icon";
import { Spinner } from "../atoms/spinner";
import { cn } from "../../lib/cn";

export type QrCodeLevel = "L" | "M" | "Q" | "H";

export type QrCodeStatus = "loading" | "success" | "expired";

export type QrCodeOptions = {
  /** Error correction. L recovers 7%, M 15%, Q 25%, and H 30%. */
  level?: QrCodeLevel;
  /** Quiet-zone modules around the code. 4 by default, the size a scanner expects. */
  margin?: number;
};

export type QrCodeProps = Omit<React.ComponentProps<"div">, "children"> &
  QrCodeOptions & {
    /** Text or URL encoded in the code. */
    value: string;
    /** Accessible name. "QR code" by default. */
    label?: string;
    /** Covers the code while it loads, after a scan, or when it expires. */
    status?: QrCodeStatus;
    /** Overlay text. Defaults from the status. */
    statusLabel?: string;
    /** Shown as a Refresh button when the code has expired. */
    onRefresh?: () => void;
    /** Refresh button label. "Refresh" by default. */
    refreshLabel?: string;
  };

const statusLabels: Record<QrCodeStatus, string> = {
  loading: "Loading",
  success: "Scanned",
  expired: "QR code expired",
};

const maxMargin = 10;

function correction(level: QrCodeLevel | undefined): QrCodeLevel {
  if (level === "L" || level === "Q" || level === "H") return level;
  return "M";
}

function quietZone(margin: number | undefined) {
  if (margin === undefined || !Number.isFinite(margin)) return 4;
  return Math.min(maxMargin, Math.max(0, Math.round(margin)));
}

type Encoded =
  { ok: true; size: number; path: string } | { ok: false; message: string; alert: boolean };

function modulePath(modules: readonly (readonly boolean[])[]) {
  const commands: string[] = [];
  for (let y = 0; y < modules.length; y += 1) {
    const row = modules[y] ?? [];
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x += 1;
        continue;
      }
      const start = x;
      while (x < row.length && row[x]) x += 1;
      commands.push(`M${start} ${y + 0.5}h${x - start}`);
    }
  }
  return commands.join("");
}

function encodeQr(value: string, options?: QrCodeOptions): Encoded {
  if (value.trim().length === 0) {
    return { ok: false, alert: false, message: "Enter a value to generate a code." };
  }

  try {
    const qr = encode(value, {
      ecc: correction(options?.level),
      border: quietZone(options?.margin),
    });
    return { ok: true, size: qr.size, path: modulePath(qr.data) };
  } catch (error) {
    if (error instanceof RangeError && error.message === "Data too long") {
      return {
        ok: false,
        alert: true,
        message:
          "This value is too long for a QR code. Shorten it, or choose a lower correction level.",
      };
    }
    return { ok: false, alert: true, message: "This value can't be encoded as a QR code." };
  }
}

/** A standalone SVG of the code, with dark modules on a white plate so it scans on its own. */
export function qrCodeSvg(value: string, options?: QrCodeOptions) {
  const encoded = encodeQr(value, options);
  if (!encoded.ok) throw new Error(encoded.message);
  const { size, path } = encoded;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#ffffff"/><path fill="none" stroke="#1c1428" stroke-width="1" d="${path}"/></svg>`;
}

function QrStatus({
  status,
  label,
  onRefresh,
  refreshLabel,
}: {
  status: QrCodeStatus;
  label: string;
  onRefresh?: () => void;
  refreshLabel: string;
}) {
  if (status === "loading") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-card/95">
        <Spinner size="lg" label={label} />
      </div>
    );
  }

  const scanned = status === "success";

  return (
    <div
      role="status"
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/95 px-4 text-center"
    >
      <Icon
        icon={scanned ? CircleCheck : CircleX}
        className={cn("size-6", scanned ? "text-success" : "text-danger")}
      />
      <span className="text-sm font-medium text-heading">{label}</span>
      {status === "expired" && onRefresh ? (
        <Button variant="text" size="sm" onClick={onRefresh}>
          <RefreshCw />
          {refreshLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function QrCode({
  value,
  level,
  margin,
  label = "QR code",
  status,
  statusLabel,
  onRefresh,
  refreshLabel = "Refresh",
  className,
  ...props
}: QrCodeProps) {
  const encoded = encodeQr(value, { level, margin });
  const overlay = statusLabel ?? (status ? statusLabels[status] : "");

  return (
    <div
      className={cn(
        "relative inline-block size-48 overflow-hidden rounded-sm border border-border bg-white text-gray-900",
        className,
      )}
      {...props}
    >
      {encoded.ok ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${encoded.size} ${encoded.size}`}
          shapeRendering="crispEdges"
          role={status ? undefined : "img"}
          aria-label={status ? undefined : label}
          aria-hidden={status ? true : undefined}
          className="block size-full"
        >
          <path fill="none" stroke="currentColor" strokeWidth={1} d={encoded.path} />
        </svg>
      ) : (
        <p
          role={encoded.alert ? "alert" : undefined}
          className="flex size-full items-center justify-center px-4 text-center text-[13px]"
        >
          {encoded.message}
        </p>
      )}
      {status && encoded.ok ? (
        <QrStatus
          status={status}
          label={overlay}
          onRefresh={onRefresh}
          refreshLabel={refreshLabel}
        />
      ) : null}
    </div>
  );
}
