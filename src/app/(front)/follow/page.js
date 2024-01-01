import {FixWidthDiv} from "@/component/common/WidthDiv";
import Follows from "@/app/(front)/follow/follows";
import {SubscribeContextManager} from "@/component/subscribeButton";

export default function Component() {
    return (
        <FixWidthDiv>
            <SubscribeContextManager>
                <Follows/>
            </SubscribeContextManager>
        </FixWidthDiv>
    );
}