import "./StockCard.css";

type StockCardProps = {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  isGain: boolean;
  isActive: boolean;
  onClick: () => void;
};

export const StockCard: React.FC<StockCardProps> = ({
  symbol,
  companyName,
  price,
  change,
  isGain,
  isActive,
  onClick,
}) => {
  return (
    <div 
      className={`stock-card ${isActive ? "active" : ""}`} 
      onClick={onClick}
    >
      <h3>{symbol}</h3>
      <h4>{companyName}</h4>
      <p>${price.toFixed(2)}</p>
      <p className={isGain ? "price-gain" : "price-loss"}>
        {isGain ? `+${change}%` : `${change}%`}
      </p>
    </div>
  );
};