export function Spinner({ size = 24 }: { size?: number }) {
    return (
        <div
        className="animate-spin rounded-full border-2 border-charcoal/10 border-t-terracotta"
        style={{ width: size, height: size }}
        />
    );
}