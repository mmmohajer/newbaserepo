import Div from "@/baseComponents/reusableComponents/Div";
import Card from "@/baseComponents/reusableComponents/Card";

const ShoppingItem = () => {
  return (
    <>
      <Div className="width-px-350">
        <Card
          cardType="shopping-item"
          courseItem={{
            preview_image_url: "https://picsum.photos/400/200",
            img_alt: "Test",
            title:
              "Building AI-Powered Apps: Integrating OpenAI API with Python",
            excerpt: `Build AI-powered apps with Python using OpenAI’s APIs — from chatbots to smart assistants.`,
            price: "9.99",
          }}
        />
      </Div>
    </>
  );
};

export default ShoppingItem;
