import MobileLayout from "@/app/(mobile)/_component/layout/MobileLayout";

export default function Component({children}) {
    return (
        <MobileLayout>
            {children}
        </MobileLayout>
    );
}