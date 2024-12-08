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
      className="fixed bg-gray-900 rounded-lg shadow-lg py-1 z-50"
      style={{
        left: contextMenu.position.x,
        top: contextMenu.position.y,
      }}
    >
      {contextMenu.isOpen &&
        contextMenu.npcType &&
        contextMenu.npcType === "enemy" && <EnemyMenu />}
    </div>
  );
}

function EnemyMenu() {
  return <div>enemy menu</div>;
}
