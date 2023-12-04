import AdminLayout from "@/app/(backend)/admin/adminLayout";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";


const is_login = () => {
    const cookieStore = cookies();
    const s = cookieStore.get("jessionId");
    return true;
}
export default function Component(props) {
    if (!is_login()) {
        redirect('/admin-login')
    }
    return (
        <>
            <AdminLayout>
                {props.children}
            </AdminLayout>
        </>
    );
}