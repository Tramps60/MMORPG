import { useUIStore } from "@/store/ui-store";
import { useEffect, useRef } from "react";

export default function ContextMenu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const contextMenu = useUIStore((state) => state.contextMenu);
  const closeContextMenu = useUIStore((state) => state.closeContextMenu);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeContextMenu]);

  if (!contextMenu.isOpen) {
    return null
  }

  return (
    <div
      ref={menuRef}
      className="fixed bg-gray-900 rounded-md p-4 shadow-lg py-1 z-50"
      style={{
        left: contextMenu.position.x,
        top: contextMenu.position.y,
      }}
    >
      {contextMenu.isOpen &&
        contextMenu.type &&
        contextMenu.type === "enemy" && <EnemyMenu />}

      {contextMenu.isOpen &&
        contextMenu.type &&
        contextMenu.type === "remote-player" && <RemotePlayerMenu />}
    </div>
  );
}

function EnemyMenu() {
  return <div className="text-xl p-12">enemy menu</div>;
}

function RemotePlayerMenu() {
  return <div>remote player menu</div>;
}
