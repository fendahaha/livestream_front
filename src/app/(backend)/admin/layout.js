import AdminLayout from "@/app/(backend)/admin/adminLayout";


export default function Component(props) {
    return (
        <>
            <AdminLayout>
                {props.children}
            </AdminLayout>
        </>
    );
}