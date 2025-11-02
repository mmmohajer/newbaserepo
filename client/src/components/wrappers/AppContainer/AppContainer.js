import cx from "classnames";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div/Div";
import Modal from "@/baseComponents/pageParts/Modal";
import Loading from "@/baseComponents/pageParts/Loading";
import Alert from "@/baseComponents/pageParts/Alert";
import AppHeader from "@/baseComponents/pageParts/AppHeader";
import SideBarDashboard from "@/baseComponents/pageParts/SideBarDashboard";
import FooterNavigation from "@/baseComponents/pageParts/FooterNavigation";
import AppSecondaryNav from "@/baseComponents/pageParts/AppSecondaryNav";
import BaseAppWrapper from "@/components/wrappers/BaseAppWrapper";

import useDivWidth from "@/hooks/useDivWidth";
import { hideMobNav } from "@/reducer/subs/isMobNavVisible";
import { setActiveDashboardItem } from "@/reducer/subs/activeDashboardItem";
import { setActiveAppSecondaryNavItem } from "@/reducer/subs/activeAppSecondaryNavItem";

const AppContainer = ({
  pageIdentifier,
  isAuthPage = false,
  hasSideBarDashboard = true,
  hasHeader = true,
  hasFooterNavigation = true,
  children,
}) => {
  const dispatch = useDispatch();
  const { type: modalType } = useSelector((state) => state.modal);
  const isLoading = useSelector((state) => state.isLoading);
  const alert = useSelector((state) => state.alert);
  const appSecondaryNavIsActive = useSelector(
    (state) => state.appSecondaryNavIsActive
  );

  const { containerRef, width } = useDivWidth();

  useEffect(() => {
    dispatch(hideMobNav());
  }, []);

  useEffect(() => {
    if (pageIdentifier) {
      dispatch(setActiveDashboardItem(pageIdentifier));
      dispatch(setActiveAppSecondaryNavItem(pageIdentifier));
    }
  }, [pageIdentifier]);

  return (
    <>
      <BaseAppWrapper isAuthPage={isAuthPage}>
        {isLoading ? <Loading /> : ""}
        {modalType ? <Modal /> : ""}
        <Div className="width-per-100 bg-theme-one min-height-vh-full">
          <Div
            ref={containerRef}
            className={cx(
              "width-per-100 global-container bg-white min-height-vh-full"
            )}
          >
            <Div className="pos-rel">
              <Alert />{" "}
            </Div>
            {width >= 800 ? (
              <Div type="flex" className="pos-rel">
                {hasSideBarDashboard && !isAuthPage ? <SideBarDashboard /> : ""}
                <Div
                  type="flex"
                  direction="vertical"
                  className="height-vh-full width-per-100 pos-rel"
                >
                  {hasHeader && (
                    <Div>
                      <AppHeader />

                      <Div
                        className="pos-abs global-transition-one"
                        style={{
                          zIndex: 100000000000000000,
                          top: "85px",
                          right: appSecondaryNavIsActive ? "5px" : "-350px",
                          visibility: appSecondaryNavIsActive
                            ? "visible"
                            : "hidden",
                        }}
                      >
                        <AppSecondaryNav />
                      </Div>
                    </Div>
                  )}

                  <Div
                    type="flex"
                    direction="vertical"
                    className="flex--gr--1 of-y-auto"
                  >
                    {children}
                  </Div>
                </Div>
              </Div>
            ) : (
              <Div type="flex" direction="vertical" className="height-vh-full">
                {/* Header is fixed at the top, to allow for scrollable header, remove this and enable the scrollable header */}
                {hasHeader && (
                  <Div className="pos-rel">
                    <AppHeader />

                    <Div
                      className="pos-abs global-transition-one"
                      style={{
                        zIndex: 100000000000000000,
                        top: "100%",
                        right: appSecondaryNavIsActive ? "5px" : "-350px",
                        visibility: appSecondaryNavIsActive
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      <AppSecondaryNav />
                    </Div>
                  </Div>
                )}
                <Div
                  type="flex"
                  direction="vertical"
                  className={cx(
                    "flex--gr--1 of-y-auto",
                    hasSideBarDashboard ? "" : ""
                  )}
                >
                  {/* For scrollable header uncomment this */}
                  {/* {hasHeader && <AppHeader />}  */}
                  {children}
                </Div>
                {hasSideBarDashboard && !isAuthPage ? <FooterNavigation /> : ""}
              </Div>
            )}
          </Div>
        </Div>
      </BaseAppWrapper>
    </>
  );
};

export default AppContainer;
