// GroupIcon.jsx
// Created By: Reo Matsuda

import { PhoneIcon, Icon } from "@chakra-ui/icons";
import { Avatar, useColorModeValue } from "@chakra-ui/react";
import { HiUserGroup } from "react-icons/hi";
import PropTypes from "prop-types";

function getIcon(icon) {
    switch (icon) {
        case "phone":
            return <PhoneIcon fontSize={"1.75rem"} />;
        default:
            return <Icon fontSize={"1.8rem"} as={HiUserGroup} />;
    }
}

function GroupIcon({ icon, bg, color }) {
    return <Avatar bg={bg} color={color} icon={getIcon(icon)} />;
}

GroupIcon.propTypes = {
    icon: PropTypes.string,
    bg: PropTypes.string,
    color: PropTypes.string,
};

GroupIcon.defaultProps = {
    icon: "",
    bg: "transparent",
    color: "white",
};

export default GroupIcon;
