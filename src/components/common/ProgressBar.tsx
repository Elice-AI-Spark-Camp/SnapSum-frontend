// components/common/ProgressBar.tsx
interface ProgressBarProps {
  progress: number;
  variant?: 'primary' | 'secondary';
}

export default function ProgressBar({ progress, variant = "primary" }: ProgressBarProps) {
  const getStyles = () => {
    if (variant === "primary") {
      return {
        bar: "bg-secondary h-1.5",
        track: "bg-gray-light h-1.5 ",
        showPercentage: false
      };
    }
    return {
      wrapper: "p-[2px] bg-white rounded-[20px] shadow-[0_2px_4px_0_rgba(0,0,0,0.1)]",
      bar: "bg-secondary h-[10px] rounded-[20px] relative",
      track: "bg-white h-[10px] rounded-[20px]",
      showPercentage: true
    };
  };

  const styles = getStyles();

  if (variant === "secondary") {
    return (
      <div className="relative">
        <div className={styles.wrapper}>
          <div className={styles.track}>
            <div
              className={`transition-all duration-300 ease-out ${styles.bar}`}
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            >
              {styles.showPercentage && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary">
                  {progress}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className={styles.track}>
        <div
          className={`transition-all duration-300 ease-out ${styles.bar}`}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}