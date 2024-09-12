import Button from "./Button";

export default function Description({ onContinue }) {
  return (
    <div className="box intro">
      <div className="description">
        <p>
          Welcome! Proceed to split the bills with your friends and family
          seamlessly.
        </p>
        <Button onClick={onContinue}>Continue to split</Button>
      </div>
    </div>
  );
}
