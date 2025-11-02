import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faCircleUser,
  faCalendarDays,
  faAngleLeft,
  faAngleRight,
  faPlayCircle,
  faAngleUp,
  faSearch,
  faCheck,
  faEye,
  faEyeSlash,
  faUpload,
  faCirclePlay,
  faMicrophone,
  faStopCircle,
  faPaperPlane,
  faVolumeHigh,
  faVolumeXmark,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faBlog,
  faCircleExclamation,
  faListCheck,
  faGauge,
  faRobot,
  faTableList,
  faSliders,
  faFileCode,
  faFileLines,
  faRightFromBracket,
  faGear,
  faMoneyBill,
  faCreditCard,
  faTrash,
  faCirclePlus,
  faUserGraduate,
  faChalkboardUser,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquareInstagram,
  faLinkedin,
  faYoutube,
  faTelegram,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

import Div from "@/baseComponents/reusableComponents/Div";

const Icon = ({
  type = "close",
  color = "black",
  width = "16px",
  height = "16px",
  scale = 1,
}) => {
  return (
    <>
      {type === "close" ? (
        <FontAwesomeIcon
          icon={faClose}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "left" ? (
        <FontAwesomeIcon
          icon={faAngleLeft}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "right" ? (
        <FontAwesomeIcon
          icon={faAngleRight}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "play-circle" ? (
        <FontAwesomeIcon
          icon={faPlayCircle}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "instagram" ? (
        <FontAwesomeIcon
          icon={faSquareInstagram}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "linkedin" ? (
        <FontAwesomeIcon
          icon={faLinkedin}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "youtube" ? (
        <FontAwesomeIcon
          icon={faYoutube}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "telegram" ? (
        <FontAwesomeIcon
          icon={faTelegram}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "github" ? (
        <FontAwesomeIcon
          icon={faGithub}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "circle-user" ? (
        <FontAwesomeIcon
          icon={faCircleUser}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "calendar-days" ? (
        <FontAwesomeIcon
          icon={faCalendarDays}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "angle-up" ? (
        <FontAwesomeIcon
          icon={faAngleUp}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "search" ? (
        <FontAwesomeIcon
          icon={faSearch}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "check-mark" ? (
        <FontAwesomeIcon
          icon={faCheck}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "eye" ? (
        <FontAwesomeIcon
          icon={faEye}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "eye-slash" ? (
        <FontAwesomeIcon
          icon={faEyeSlash}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "upload" ? (
        <FontAwesomeIcon
          icon={faUpload}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "circle-play" ? (
        <FontAwesomeIcon
          icon={faCirclePlay}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "stop-circle" ? (
        <FontAwesomeIcon
          icon={faStopCircle}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "paper-plane" ? (
        <FontAwesomeIcon
          icon={faPaperPlane}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "volume-high" ? (
        <FontAwesomeIcon
          icon={faVolumeHigh}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "volume-xmark" ? (
        <FontAwesomeIcon
          icon={faVolumeXmark}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "microphone" ? (
        <FontAwesomeIcon
          icon={faMicrophone}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "microphone-slash" ? (
        <FontAwesomeIcon
          icon={faMicrophoneSlash}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "video" ? (
        <FontAwesomeIcon
          icon={faVideo}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "video-slash" ? (
        <FontAwesomeIcon
          icon={faVideoSlash}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "blog" ? (
        <FontAwesomeIcon
          icon={faBlog}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "circle-exclamation" ? (
        <FontAwesomeIcon
          icon={faCircleExclamation}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "list-check" ? (
        <FontAwesomeIcon
          icon={faListCheck}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "gauge" ? (
        <FontAwesomeIcon
          icon={faGauge}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "robot" ? (
        <FontAwesomeIcon
          icon={faRobot}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "table-list" ? (
        <FontAwesomeIcon
          icon={faTableList}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "sliders" ? (
        <FontAwesomeIcon
          icon={faSliders}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "file-code" ? (
        <FontAwesomeIcon
          icon={faFileCode}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "file-lines" ? (
        <FontAwesomeIcon
          icon={faFileLines}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "right-from-bracket" ? (
        <FontAwesomeIcon
          icon={faRightFromBracket}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "gear" ? (
        <FontAwesomeIcon
          icon={faGear}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "money-bill" ? (
        <FontAwesomeIcon
          icon={faMoneyBill}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "credit-card" ? (
        <FontAwesomeIcon
          icon={faCreditCard}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "trash" ? (
        <FontAwesomeIcon
          icon={faTrash}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "circle-plus" ? (
        <FontAwesomeIcon
          icon={faCirclePlus}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "user-graduate" ? (
        <FontAwesomeIcon
          icon={faUserGraduate}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "chalkboard-user" ? (
        <FontAwesomeIcon
          icon={faChalkboardUser}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}

      {type === "shopping-cart" ? (
        <FontAwesomeIcon
          icon={faShoppingCart}
          style={{ color, width, height, transform: `scale(${scale})` }}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Icon;
