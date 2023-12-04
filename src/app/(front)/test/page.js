import Stomp from "@/app/(front)/test/Stomp";
import {FixWidthDiv} from "@/component/common/WidthDiv";

export default function Component() {
    return (
        <div>
            <FixWidthDiv>
                <Stomp/>
            </FixWidthDiv>
        </div>
    );
}