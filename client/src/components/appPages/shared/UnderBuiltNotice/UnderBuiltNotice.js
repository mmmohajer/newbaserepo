import Div from "@/baseComponents/reusableComponents/Div";
import Paragraph from "@/baseComponents/reusableComponents/Paragraph";

const UnderBuiltNotice = () => {
  return (
    <>
      <Div
        type="flex"
        hAlign="center"
        vAlign="center"
        className="min-height-px-100 width-per-100"
      >
        <Paragraph className="width-per-100 max-width-px-600 text-center">
          Great things take time to build — and we’re crafting this section with
          care. Check back soon for new tools and insights!
        </Paragraph>
      </Div>
    </>
  );
};

export default UnderBuiltNotice;
