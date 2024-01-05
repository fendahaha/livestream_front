import MobileLayout from "@/app/(mobile)/component/layout/MobileLayout";

export default function Component({children}) {
    return (
        <MobileLayout>
            {children}
        </MobileLayout>
    );
}