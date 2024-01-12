import {SubscribeContextManager} from "@/component/subscribeButton";
import Follows from "@/app/(mobile)/mobile/follow/follows";
import PagePadding from "@/app/(mobile)/_component/common/pagePadding";

export default function Component() {
    return (
        <PagePadding>
            <SubscribeContextManager>
                <Follows/>
            </SubscribeContextManager>
        </PagePadding>
    );
}