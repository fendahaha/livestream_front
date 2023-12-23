import AdminLayout from "@/app/(backend)/admin/adminLayout";
import {getLoginUser} from "@/app/_func/server";
import {GlobalContextManager} from "@/app/(front)/component/globalContext";


export default async function Component(props) {
    const userInfo = await getLoginUser()
    return (
        <>
            <GlobalContextManager userInfo={userInfo}>
                <AdminLayout>
                    {props.children}
                </AdminLayout>
            </GlobalContextManager>
        </>
    );
}