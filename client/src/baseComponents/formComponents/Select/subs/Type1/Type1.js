import { useEffect, useState } from "react";
import cx from "classnames";

import Div from "@/baseComponents/reusableComponents/Div";
import Icon from "@/baseComponents/reusableComponents/Icon";
import Label from "@/baseComponents/formComponents/Label";
import TextBox from "@/baseComponents/formComponents/TextBox";

import { COLORS } from "@/constants/vars";

const Type1 = ({
  options,
  val,
  optionChanged,
  placeHolder,
  label,
  isRequired,
  optionsContainerIsAbsolute = true,
  optionsContainerWidth = "100%",
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    setFilteredOptions([...options]);
  }, [options]);

  useEffect(() => {
    if (searchTerm && options?.length) {
      const filteredOptions = options.filter((opt) =>
        opt?.shownText
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toString().toLowerCase())
      );
      if (filteredOptions?.length) {
        options = filteredOptions;
      }
    }
    setFilteredOptions(options);
  }, [searchTerm]);
  return (
    <>
      {showOptions && optionsContainerIsAbsolute ? (
        <Div
          onClick={() => {
            setShowOptions(false);
          }}
          className="pos-fix pos-fix--lt height-vh-full width-per-100 z-100 of-hidden"
        />
      ) : (
        ""
      )}
      <Label label={label} isRequired={isRequired} />
      <Div
        className={cx(
          "p-all-temp-1 f-s-px-16 br-rad-px-10 br-all-solid-2 br-black width-per-100 pos-rel"
        )}
      >
        <Div
          onClick={() => setShowOptions(true)}
          type="flex"
          distributedBetween
          vAlign="center"
          className={cx("width-per-100 p-x-temp-3 height-px-35 mouse-hand")}
        >
          {!showOptions ? (
            <Div>
              {val ? (
                options.find((opt) => opt.value === val)?.shownText || val
              ) : (
                <span className="text-gray f-s-px-12">{placeHolder}</span>
              )}
            </Div>
          ) : (
            <Div className="width-per-100 pos-rel">
              <input
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  position: "absolute",
                  top: "-20px",
                  left: 0,
                  width: "100%",
                  height: "40px",
                  outline: "none",
                  border: "none",
                  zIndex: 100000000000,
                }}
              />
            </Div>
          )}
          <Div
            className={cx(
              "global-transition-one",
              showOptions ? "global-rotate-180" : ""
            )}
          >
            <Icon type="angle-up" color={"black"} />
          </Div>
        </Div>

        <Div
          type="flex"
          direction="vertical"
          className={cx(
            `bg-white width-per-100 global-transition-one of-y-auto  scroll-type-one`,
            optionsContainerIsAbsolute ? "pos-abs pos-abs--lb" : "pos-rel",
            showOptions ? "br-all-solid-2 br-theme-two br-rad-px-15" : "br-none"
          )}
          style={{
            maxHeight: showOptions ? "300px" : "0px",
            zIndex: 100000000,
            width: optionsContainerWidth,
          }}
        >
          {filteredOptions?.map((item, idx) => (
            <Div
              className={cx(
                "p-all-temp-3 br-bottom-solid-2 br-theme-one bg-theme-one-on-hover text-center mouse-hand text-theme-two"
              )}
              key={idx}
              onClick={() => {
                if (optionChanged) {
                  optionChanged(item?.value);
                  setSearchTerm("");
                }
                setShowOptions(false);
              }}
            >
              {item?.shownText}
            </Div>
          ))}
        </Div>
      </Div>
    </>
  );
};

export default Type1;
