interface VideoButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
  }
  
  export default function VideoButton({ onClick, icon, label }: VideoButtonProps) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  }
  