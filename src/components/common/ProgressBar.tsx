interface ProgressBarProps {
  progress: number;
  variant?: "primary" | "secondary";
}

export default function ProgressBar({ progress, variant = "primary" }: ProgressBarProps) {
  const getStyles = () => {
    if (variant === "primary") {
      return {
        bar: "bg-secondary h-1.5",
        track: "bg-gray-light h-1.5",
        showPercentage: false,
      };
    }
    return {
      wrapper: "p-[2px] bg-white rounded-[20px] shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] relative",
      bar: "bg-secondary h-[10px] rounded-[20px] relative",
      track: "bg-white h-[10px] rounded-[20px]",
      showPercentage: true,
    };
  };

  const styles = getStyles();

  if (variant === "secondary") {
    return (
      <div className="relative w-full">
        <div className={styles.wrapper}>
          <div className={styles.track}>
            <div
              className={`transition-all duration-300 ease-out ${styles.bar}`}
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
          {styles.showPercentage && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-primary">
              {progress}%
            </span>
          )}
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