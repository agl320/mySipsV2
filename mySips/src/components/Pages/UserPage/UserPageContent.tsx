import { Link, Navigate } from "react-router-dom";
import { useSigninCheck } from "reactfire";
import UserNav from "./UserComponents/UserNav";
import UserApplication from "./UserComponents/UserApplication/UserApplication";
import { useState } from "react";

export enum PageTypes {
    OVERVIEW = "OVERVIEW",
    SOCIAL = "SOCIAL",
    ANALYTICS = "ANALYTICS",
    MYSIPS = "MYSIPS",
    ADMIN = "ADMIN",
    UPGRADE = "UPGRADE",
    BUG = "BUG",
    SETTINGS = "SETTINGS",
}

function UserPageContent() {
    const { status, data: signInCheckResult } = useSigninCheck();

    const [selectedPage, setSelectedPage] = useState<PageTypes>(
        PageTypes.OVERVIEW
    );

    // if loading, display some loading component
    if (status === "loading") {
        return <span>loading...</span>;
    }

    // If not signed in, return to home page
    if (signInCheckResult.signedIn === false) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex min-h-screen min-w-screen">
            <UserNav setSelectedPage={setSelectedPage} />
            <div className="flex w-full">
                <UserApplication selectedPage={selectedPage} />
            </div>
        </div>
    );
}

export default UserPageContent;
