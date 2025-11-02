import { useDispatch, useSelector } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div";
import AppImage from "@/baseComponents/reusableComponents/AppImage";
import Icon from "@/baseComponents/reusableComponents/Icon";
import Anchor from "@/baseComponents/reusableComponents/Anchor";

import { COLORS } from "@/constants/vars";
import { STORAGE_BASE_URL } from "config";
import { toggleAppSecondaryNav } from "@/reducer/subs/appSecondaryNavIsActive";
import { PAGE_ROUTES } from "@/constants/pageRoutes";

const AppHeader = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const shoppingCart = useSelector((state) => state.shoppingCart);

  return (
    <>
      <Div
        type="flex"
        distributedBetween
        vAlign="center"
        className="height-px-85 br-bottom-solid-2 br-theme-one p-r-16 flex--shrink--0"
      >
        <Div
          type="flex"
          hAlign="center"
          vAlign="center"
          className="mouse-hand p-x-16"
        >
          <Anchor to="/" ariaLabel="Go to Dashboard" anchorType="no-effect">
            <AppImage
              src={`${STORAGE_BASE_URL}/media/general/new-tech-tips-logo.png`}
              width={50}
              heightOverWidthAsprctRatio={1}
              alt="Logo of Tech Tips By Moh brand"
              key={`logo-dashboard`}
            />
          </Anchor>
        </Div>
        <Div type="flex" className="gap-16">
          <Anchor
            to={PAGE_ROUTES.APP.SHOPPING_CART}
            ariaLabel="Go to Shopping Cart"
            anchorType="no-effect"
          >
            <Div
              type="flex"
              hAlign="center"
              vAlign="center"
              className="mouse-hand width-px-50 height-px-50 pos-rel"
            >
              <Icon
                type="shopping-cart"
                scale={2}
                color={COLORS["theme-two"]}
              />
              {shoppingCart?.length ? (
                <Div
                  type="flex"
                  hAlign="center"
                  vAlign="center"
                  className="pos-abs bg-theme-six text-theme-one width-px-30 height-px-30 f-s-px-14 f-b br-rad-px-50"
                  style={{ top: "-10px", right: "-10px" }}
                >
                  {shoppingCart.length > 9 ? "9+" : shoppingCart.length}
                </Div>
              ) : null}
            </Div>
          </Anchor>
          <Div
            type="flex"
            hAlign="center"
            vAlign="center"
            className="width-px-50 height-px-50 br-rad-per-50 of-hidden mouse-hand"
            onClick={() => dispatch(toggleAppSecondaryNav())}
          >
            {profile?.profile_photo ? (
              <AppImage
                src={profile?.profile_photo}
                width={50}
                heightOverWidthAsprctRatio={1}
                alt="User Avatar"
                className=""
              />
            ) : (
              <Icon type="circle-user" scale={3} color={COLORS["theme-two"]} />
            )}
          </Div>
        </Div>
      </Div>
    </>
  );
};

export default AppHeader;
