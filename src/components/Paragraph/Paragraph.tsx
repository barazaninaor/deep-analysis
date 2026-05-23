import "./Paragraph.css";

type ParagraphProps = {
  text: string;
};

export const Paragraph: React.FC<ParagraphProps> = ({ text }) => {
  return (
    <div className="paragraph-container">
      <p>{text}</p>
    </div>
  );
};