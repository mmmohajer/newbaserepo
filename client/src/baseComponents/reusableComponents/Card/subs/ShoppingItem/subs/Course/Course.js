import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import { useRouter } from "next/router";

import Div from "@/baseComponents/reusableComponents/Div";
import AppImage from "@/baseComponents/reusableComponents/AppImage";
import Heading from "@/baseComponents/reusableComponents/Heading";
import Icon from "@/baseComponents/reusableComponents/Icon/Icon";

import useDivWidth from "@/hooks/useDivWidth";
import { removeFromCart } from "@/utils/shppingCard";
import { setModal } from "@/reducer/subs/modal";

const Course = ({ courseItem }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { containerRef, width } = useDivWidth();
  const shoppingCart = useSelector((state) => state.shoppingCart);

  const [itemIsAlreadyInCart, setItemIsAlreadyInCart] = useState(false);
  useEffect(() => {
    setItemIsAlreadyInCart(
      shoppingCart.some((item) => item.id === courseItem.id)
    );
  }, [shoppingCart]);

  return (
    <>
      <Div
        ref={containerRef}
        className={cx(
          "width-per-100 br-rad-3xl of-hidden p-b-temp-5 br-theme-two br-all-solid-2 bg-theme-three text-theme-five"
        )}
      >
        <Div className="width-per-100 global-img-reg-asp pos-rel">
          {width ? (
            <AppImage
              key={`shoppingItemImageCard-${width}`}
              src={courseItem?.course?.preview_image_url}
              alt={courseItem?.img_alt || "Course Image"}
              width={width}
              heightOverWidthAsprctRatio={1080 / 1920}
              className=""
            />
          ) : null}
        </Div>

        <Div className="p-x-temp-4">
          <Heading type={5} className="m-y-temp-5" style={{ height: "110px" }}>
            {courseItem?.course?.title}
          </Heading>
          {/* <Div className="four-lines m-b-temp-5" style={{ height: "130px" }}>
            {courseItem?.excerpt}
          </Div> */}
          <Div type="flex" distributedBetween vAlign="center" className="">
            <Div className="f-b text-theme-two f-s-px-20 width-per-100 text-theme-two br-rad-px-10">
              {`$${courseItem?.price}`}
            </Div>
            <Div
              type="flex"
              hAlign="center"
              vAlign="center"
              className="width-px-30 height-px-30 mouse-hand"
              onClick={() =>
                dispatch(
                  setModal({
                    type: "prompt-message",
                    props: {
                      message:
                        "Are you sure you want to remove this item from your cart?",
                      confirmBtnText: "Delete",
                      confirmBtnAction: () => {
                        removeFromCart(dispatch, courseItem.id);
                      },
                      cancelBtnText: "Cancel",
                      // cancelBtnAction: () => {
                      //   console.log("Cancel button clicked!");
                      //   alert("Cancelled!");
                      // },
                    },
                  })
                )
              }
            >
              <Icon type="trash" scale={1.5} color="red" />
            </Div>
          </Div>
        </Div>
      </Div>
    </>
  );
};

export default Course;
