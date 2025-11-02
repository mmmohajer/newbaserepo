import cx from "classnames";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div";
import Header from "@/baseComponents/pageParts/Header";
import Modal from "@/baseComponents/pageParts/Modal";
import Alert from "@/baseComponents/pageParts/Alert";
import Loading from "@/baseComponents/pageParts/Loading";
import Footer from "@/baseComponents/pageParts/Footer";

import useDivWidth from "@/hooks/useDivWidth";
import { hideMobNav } from "@/reducer/subs/isMobNavVisible";
import { setActiveMenu } from "@/reducer/subs/activeMenu";
import { setActiveSubMenuItem } from "@/reducer/subs/activeSubMenuItem";
import { setScrollPos } from "@/reducer/subs/scrollPos";

const PageContainer = ({
  pageIdentifier,
  pageSubNavIdentifier,
  hasHeader = true,
  hasFooter = true,
  children,
}) => {
  const dispatch = useDispatch();
  const { containerRef, width } = useDivWidth(true);
  const { type: modalType } = useSelector((state) => state.modal);
  const isLoading = useSelector((state) => state.isLoading);
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setTimeout(() => {
        dispatch(setScrollPos(window.scrollY));
      }, 200);
    });
  }, []);

  useEffect(() => {
    dispatch(hideMobNav());
  }, []);

  useEffect(() => {
    if (pageIdentifier) {
      dispatch(setActiveMenu(pageIdentifier));
    }
  }, [pageIdentifier]);

  useEffect(() => {
    if (pageSubNavIdentifier) {
      dispatch(setActiveSubMenuItem(pageSubNavIdentifier));
    } else {
      dispatch(setActiveSubMenuItem(""));
    }
  }, [pageSubNavIdentifier]);

  return (
    <>
      {isLoading ? <Loading /> : ""}
      {modalType ? <Modal /> : ""}
      {alert?.length ? <Alert /> : ""}
      <Div
        type="flex"
        className="width-per-100 min-height-vh-full bg-silver"
        direction="vertical"
      >
        {hasHeader ? (
          <Div className="flex--shrink--0">
            <Header isHome={pageIdentifier === "home"} />
          </Div>
        ) : null}
        <Div
          type="flex"
          direction="vertical"
          ref={containerRef}
          className={cx("width-per-100 flex--grow--1")}
        >
          {children}
        </Div>
        {hasFooter ? (
          <Div className="flex--shrink--0">
            <Footer />
          </Div>
        ) : null}
      </Div>
    </>
  );
};

export default PageContainer;
