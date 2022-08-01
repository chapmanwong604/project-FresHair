import "./BackButton.css";
import { Link, useLocation } from "react-router-dom";
import { routes } from '../routes';
import { ArrowBackUp } from "tabler-icons-react";
import { Box } from "@mantine/core";


const availablePages = [
    routes.register,
    routes.login
]

interface TabBarProps {
    currentHref: string
}
function BackButton(props: TabBarProps) {
    return (
        <Box sx={{ maxWidth: 340 }} mx="auto">
            <div className={availablePages.includes(props.currentHref) ? "BackButtonMargin" : ""}>
                <div className={availablePages.includes(props.currentHref) ? "BackButton" : "backbutton-disabled"}>
                    <Link to="/home">
                        <div className="back-icon">
                            <ArrowBackUp size={24} strokeWidth={2} />
                            <div className="back-icon-text">
                                返回
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </Box>
    )
}

export default () => {
    const location = useLocation()
    return <BackButton currentHref={location.pathname} />
}