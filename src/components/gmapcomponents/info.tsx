export function Info({ name }: { name: string }) {
  return (
    <div className="w-32 h-32 fixed bottom-0 bg-white text-red-800">{name}</div>
  );
}
