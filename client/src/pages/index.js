import Seo from "@/components/wrappers/Seo";
import PageContainer from "@/components/wrappers/PageContainer";
import Home from "@/components/publicWebPages/Home";

const index = () => {
  return (
    <>
      <Seo
        title="PAGE_TITLE"
        keywords="PAGE_KEYWORDS"
        description="PAGE_DESCRIPTION"
        imagePreview="PAGE_IMAGE_PREVIEW"
        url="PAGE_URL"
        imgAlt="PAGE_IMAGE_ALT"
      >
        <PageContainer pageIdentifier="home">
          <Home />
        </PageContainer>
      </Seo>
    </>
  );
};

export default index;
