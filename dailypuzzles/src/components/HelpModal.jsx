import { X } from "lucide-react";
import "../styles/help.css";

export default function HelpModal({ open, onClose, title, children }) {

  if (!open) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="help">
        <div className="close" onClick={onClose}>
          <X size={20} />
        </div>

        <h2>{title}</h2>

        {children}
      </div>
    </>
  );
}
