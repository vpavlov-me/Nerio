export interface AvatarProps {
  name: string;
  src?: string;
}

export function Avatar({ name, src }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="n-avatar" data-slot="root">
      {src ? (
        <img src={src} alt={name} data-slot="image" />
      ) : (
        <span data-slot="fallback">{initials}</span>
      )}
    </span>
  );
}
