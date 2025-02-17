import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import UserBlock from "../UserComponents/Blocks/UserBlock";
import {
    doesConnectionExist,
    userRemoveConnection,
    userSetConnection,
} from "@/firebase/ConnectionHelpers";
import { ConnectionStatus } from "@/classes/Connection";
import { useFirestore } from "reactfire";
import _ from "lodash";
import UserPageHeader from "../UserPageHeader/UserPageHeader";
import { Button } from "@/components/ui/button";
import {
    Check,
    Grab,
    User,
    UserRoundMinus,
    UserRoundSearch,
    X,
} from "lucide-react";
import ConfirmDialog from "@/components/DrinkDisplay/ConfirmDialog/ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FriendsPage = ({ user }) => {
    const [userConnections, setUserConnections] = useState<any>({});
    const firestore = useFirestore();

    useEffect(() => {
        const usersCollectionRef = collection(firestore, "users");
        const unsubscribeUsers = onSnapshot(
            usersCollectionRef,
            (querySnapshot) => {
                // Fetch users
                const fetchedUsers = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    uid: doc.id,
                }));

                // Fetch connections with real-time updates
                const connectionUnsubscribes = fetchedUsers.map((userData) => {
                    if (user?.uid !== userData.uid) {
                        return doesConnectionExist(
                            user?.uid ?? "",
                            userData.uid,
                            // callback in this case will update local connection data
                            (connectionData: {
                                connectionExists: true;
                                connection: ConnectionStatus;
                            }) => {
                                const pairUid = [user?.uid, userData.uid]
                                    .sort()
                                    .join("_");

                                const userConnectionItem = {
                                    ...connectionData,
                                    ...userData,
                                };
                                setUserConnections(
                                    (prevUserConnections: any) => {
                                        return {
                                            ...prevUserConnections,
                                            [pairUid]: userConnectionItem,
                                        };
                                    }
                                );
                            }
                        );
                    }
                    return null;
                });

                // Clean up listeners when component unmounts
                return () =>
                    connectionUnsubscribes.forEach((unsubscribe) => {
                        if (unsubscribe) unsubscribe();
                    });
            },
            (error) => {
                console.error("Error fetching users:", error.message);
            }
        );

        // Clean up user listener
        return () => unsubscribeUsers();
    }, [firestore, user?.uid]);

    useEffect(() => {
        console.log(userConnections);
    }, [userConnections]);

    const getButtonComponent = (userData: any) => {
        if (userData.connection?.status === ConnectionStatus.Pending) {
            if (userData.connection?.requesterUid === user?.uid) {
                return (
                    <Button
                        onClick={() =>
                            userRemoveConnection(user.uid, userData.uid)
                        }
                        className="bg-pastel-orange bg-opacity-30 rounded-md ml-2 h-full w-full text-base text-pastel-orange"
                    >
                        Pending...
                    </Button>
                );
            }
            return (
                <>
                    <Button
                        onClick={() =>
                            userSetConnection(
                                ConnectionStatus.Friend,
                                user.uid,
                                userData.uid
                            )
                        }
                        className="bg-pastel-green  rounded-md ml-2 h-full w-full text-base text-white"
                    >
                        <Check
                            // stroke="#ff844b"
                            strokeWidth={3}
                        />
                    </Button>

                    <Button
                        onClick={() =>
                            userRemoveConnection(user.uid, userData.uid)
                        }
                        className="bg-pastel-pink rounded-md ml-2 h-full w-full text-base text-white"
                    >
                        <X
                            // stroke="#ff844b"
                            strokeWidth={3}
                        />
                    </Button>
                </>
            );
        } else if (userData.connection?.status === ConnectionStatus.Friend) {
            return (
                <ConfirmDialog
                    callback={() =>
                        userRemoveConnection(user.uid, userData.uid)
                    }
                    title="Confirm Remove Friend"
                    description={`Are you sure you want to remove ${userData.name} from
                            your friends list?`}
                    confirm="Remove Friend"
                    cancel="Cancel"
                    customTrigger={
                        <Button className="bg-gradient-to-r from-pastel-pink to-pastel-orange rounded-md ml-2 h-full text-base aspect-square">
                            <UserRoundMinus
                                // stroke="#ff844b"
                                strokeWidth={3}
                            />
                        </Button>
                    }
                />
            );
        }
        return (
            <Button
                onClick={() =>
                    userSetConnection(
                        ConnectionStatus.Pending,
                        user.uid,
                        userData.uid
                    )
                }
                className="bg-gradient-to-r from-pastel-pink to-pastel-orange rounded-md ml-2 h-full w-full text-base"
            >
                Send Request
            </Button>
        );
    };

    const getInitials = (name: string) => {
        if (!name) return;
        const nameParts = name.split(" ");
        const initials =
            nameParts.length > 1
                ? `${nameParts[0][0]}${nameParts[1][0]}`
                : `${nameParts[0][0]}`;
        return initials.toUpperCase();
    };

    return (
        <div className="w-full h-full p-8 text-white bg-background-dark">
            <UserBlock>
                <UserPageHeader
                    pageTitle="Friends"
                    linkTrail={[{ value: "Social" }, { value: "Friends" }]}
                    pageCaption="Keep up-to-date with your friends and their drinks."
                />
                <div className="flex gap-x-4 mt-8">
                    {Object.values(userConnections).map(
                        (userData: any, index) => {
                            if (
                                user?.uid !== userData.uid &&
                                userData.connection?.status ===
                                    ConnectionStatus.Friend
                            ) {
                                return (
                                    <div
                                        key={`user-${index}`}
                                        className="h-[250px] min-w-[200px] p-2 rounded-md bg-gradient-to-tr from-white/10 to-white/5 space-y-4 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="w-full h-[80px] bg-pastel-orange bg-opacity-50 rounded-md"></div>

                                            <Avatar className="mt-[-60px] w-[80px] h-[80px] aspect-square bg-pastel-orange mx-auto border-4 border-white/15 mb-2 rounded-md">
                                                <AvatarFallback className="text-4xl font-semibold">
                                                    {getInitials(userData.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <h2 className="text-2xl font-medium text-white text-center mt-4">
                                                {userData.name}
                                            </h2>
                                        </div>
                                        <div className="flex">
                                            <Button
                                                className={`h-full bg-gradient-to-r from-pastel-pink to-pastel-orange bg-opacity-30 rounded-md 
                                            ${
                                                userData.connection?.status ===
                                                ConnectionStatus.Friend
                                                    ? "w-full"
                                                    : "aspect-square"
                                            }
                                                `}
                                            >
                                                <UserRoundSearch
                                                    // stroke="#ff844b"
                                                    strokeWidth={3}
                                                />
                                            </Button>
                                            {getButtonComponent(userData)}
                                        </div>
                                    </div>
                                );
                            }
                        }
                    )}
                </div>
            </UserBlock>

            <UserBlock className="mt-4">
                <h1 className="text-3xl font-semibold font-display">Users</h1>
                <div className="gap-x-4 mt-4 flex">
                    {Object.values(userConnections).map(
                        (userData: any, index) => {
                            if (user?.uid !== userData.uid) {
                                return (
                                    <div
                                        key={`user-${index}`}
                                        className="h-[250px] min-w-[200px] p-2 rounded-md bg-gradient-to-tr from-white/10 to-white/5 space-y-4 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="w-full h-[80px] bg-pastel-orange bg-opacity-50 rounded-md"></div>

                                            <Avatar className="mt-[-60px] w-[80px] h-[80px] aspect-square bg-pastel-orange mx-auto border-4 border-white/15 mb-2 rounded-md">
                                                <AvatarFallback className="text-4xl font-semibold">
                                                    {getInitials(userData.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <h2 className="text-2xl font-medium text-white text-center mt-4">
                                                {userData.name}
                                            </h2>
                                        </div>
                                        <div className="flex">
                                            <Button
                                                className={`h-full bg-gradient-to-r from-pastel-pink to-pastel-orange bg-opacity-30 rounded-md 
                                            ${
                                                userData.connection?.status ===
                                                ConnectionStatus.Friend
                                                    ? "w-full"
                                                    : "aspect-square"
                                            }
                                                `}
                                            >
                                                <UserRoundSearch
                                                    // stroke="#ff844b"
                                                    strokeWidth={3}
                                                />
                                            </Button>
                                            {getButtonComponent(userData)}
                                        </div>
                                    </div>
                                );
                            }
                        }
                    )}
                </div>
            </UserBlock>
        </div>
    );
};

export default FriendsPage;
