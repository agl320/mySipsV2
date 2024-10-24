import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function UserPageHeader({
    pageTitle,
    linkTrail,
}: {
    pageTitle: string;
    linkTrail: Array<{ href?: string; value: string }>;
}) {
    return (
        <div>
            <div className="pb-4">
                <h1 className="text-3xl">{pageTitle}</h1>
            </div>
            <div>
                <Breadcrumb>
                    <BreadcrumbList>
                        {linkTrail.map((linkItem, index) => {
                            return (
                                <>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink
                                            href={linkItem.href ?? "#"}
                                        >
                                            {linkItem.value}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {index < linkTrail.length - 1 ? (
                                        <BreadcrumbSeparator />
                                    ) : (
                                        <></>
                                    )}
                                </>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </div>
    );
}

export default UserPageHeader;
