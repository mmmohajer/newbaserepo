import Div from "@/baseComponents/reusableComponents/Div";
import Card from "@/baseComponents/reusableComponents/Card";

const CreditCard = () => {
  return (
    <>
      <Div className="width-px-350">
        <Card
          cardType="credit-card"
          last4="4242"
          brand="visa"
          expMonth="12"
          expYear="2025"
          isDefault={false}
        />
      </Div>
    </>
  );
};

export default CreditCard;
